import React from 'react';

export default function Config() {
  return (
    <div>
      <h1>Configuration Page</h1>
      <p>Here you can modify your preferences and account settings.</p>
      
      <div>
        <h2>Change Password</h2>
        <input type="password" placeholder="New Password" />
        <button>Change Password</button>
      </div>

      <div>
        <h2>Update Username</h2>
        <input type="text" placeholder="New Username" />
        <button>Update Username</button>
      </div>

      <div>
        <h2>Other Preferences</h2>
        <label>
          <input type="checkbox" /> Enable Dark Mode
        </label>
        <button>Save Preferences</button>
      </div>
    </div>
  );
}
