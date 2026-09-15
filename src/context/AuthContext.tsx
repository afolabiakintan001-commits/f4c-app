"use client";

import { createContext, useEffect, useState, ReactNode, useContext } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

// Define the shape of the user profile
interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  points: number;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'dummy-key';

const supabase = createBrowserClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce',
  },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string, userMeta?: any) => {
    try {
      // 1. Use maybeSingle() so missing rows don't throw an error
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

      if (error) {
        if (error.message && error.message.includes('JWT issued at future')) {
          console.warn('Session expired due to clock skew, signing out...');
          await signOut();
        }
        console.error('Error fetching profile:', error.message || error)
        setProfile(null)
        return
      }

      // 2. If no profile exists, create a default profile on the fly
      if (!data) {
        const fallbackUsername = 
          userMeta?.username || 
          userMeta?.email?.split('@')[0] || 
          `user_${userId.substring(0, 8)}`

        const defaultProfile = {
          id: userId,
          username: fallbackUsername,
          full_name: userMeta?.full_name || userMeta?.name || fallbackUsername,
          avatar_url: userMeta?.avatar_url || '',
          points: 500,
        }

        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert(defaultProfile, { onConflict: 'id' })
          .select()
          .maybeSingle()

        if (createError) {
          console.error('Error auto-creating profile:', createError.message)
          setProfile(defaultProfile as any)
        } else {
          setProfile(newProfile || (defaultProfile as any))
        }
      } else {
        setProfile(data)
      }
    } catch (err) {
      console.error('Unexpected error in fetchProfile:', err)
      setProfile(null)
    }
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id, user.user_metadata);
    }
  };

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.user_metadata);
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchProfile(session.user.id, session.user.user_metadata);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signIn, signUp, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}
