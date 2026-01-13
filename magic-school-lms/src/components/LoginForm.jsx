export default function LoginForm() {
    return (
        <div>
          <h2>Login</h2>
            <form>
              <label>Email:
                <input 
                  type="email" 
                  placeholder="Email" 
                />
              </label>
            <br></br>
              <label>Password:
                <input 
                  type="password" 
                  placeholder="Password" 
                />
              </label>
            <br></br>
          <button type="submit">Login</button>
        </form>
      </div>
    );
}