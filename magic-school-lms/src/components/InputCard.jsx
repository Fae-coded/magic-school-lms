import './InputCard.css';

export function InputCard({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    username,
    onUsernameChange,
    email,
    onEmailChange,
    role,
    onRoleChange,
    buttonText,
    onPrimaryClick,
    secondButtonText,
    onCancelClick
}) {
    return (
        <div className="input-card">
            {onTitleChange &&
            <label className= "input-card-title-label"> Course Title:
                <br></br>
            <input
                className="input-card-title"
                value={title}
                onChange={onTitleChange}
                placeholder='Enter course title here'
                name="title"
                minLength={5}
                maxLength={75}
                required
            />
            </label>}

            {onUsernameChange && 
            <label className= "input-card-username-label">Username:
            <br></br>
            <input
                className="input-card-username"
                value={username}
                onChange={onUsernameChange}
                name="username"
                required
            />
            </label>}

            <div className= "input-card-button-container">
            <button className="input-card-button" onClick={onPrimaryClick}>{buttonText}</button>
            <button className="input-second-card-button" onClick={onCancelClick}>{secondButtonText}</button>
            </div>

            {onDescriptionChange && 
            <label className= "input-card-description-label">Course Description:
                <br></br>
                <textarea  
                className="input-card-content"
                value={description}
                onChange={onDescriptionChange}
                placeholder='Enter course description here'
                name="description"
                rows="6"
                cols="40"
                minLength={10}
                maxLength={300}
                required           
            />
            </label>}

            {onEmailChange && 
            <label className= "input-card-email-label">Email:
            <br></br>
            <input
                className="input-card-email"
                value={email}
                onChange={onEmailChange}
                name="email"
                required
            />
            </label>}

            {onRoleChange && 
            <label className= "input-card-role-label">Role:
            <br></br>
            <select
                className="input-card-role"
                value={role}
                onChange={onRoleChange}
                name="role">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            </label>
            }            
        </div>
    );
}