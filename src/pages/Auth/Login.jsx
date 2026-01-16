import React from 'react'

export function Login() {
  return (
    <div>
      <h2>Login</h2>
      <form>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Login</button>
        <div>
            <a href="/forgot-password">Forgot Password?</a>
            <a href="/register">Register</a>
        </div>
      </form>
    </div>
  )
}
