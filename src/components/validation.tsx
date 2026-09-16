import React from 'react';

export function ValidationBanner({ issues }: { issues: string[] }) {
  if (!issues || issues.length === 0) return null;
  return (
    <div className="validation-banner">
      <div className="vb-header">
        <span className="sq" />
        <span className="vb-title">Before you continue</span>
      </div>
      <ul className="vb-list">
        {issues.map((issue, i) => (
          <li key={i}>
            <span className="sq-sm" />
            {issue}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FieldError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="field-error">
      <span className="sq-sm" />
      {message}
    </div>
  );
}
