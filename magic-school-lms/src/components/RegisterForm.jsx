export default function RegisterForm() {
    return (
        <div>
          <h2>Register</h2>
            <form>
              <label>Name:
                <input 
                type="text" 
                placeholder="Name" />
              </label>
              <br></br>
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
          <button type="submit">Register</button>
        </form>
      </div>
    );
}