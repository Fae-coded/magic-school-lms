import './InputCard.css';

export function InputCard({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
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
        <div className="card">
            <input
                className="input-card-title"
                value={title}
                onChange={onTitleChange}
                placeholder='Enter course title here'
                name="title"
            />
            {onDescriptionChange && <textarea  
                className="input-card-content"
                value={description}
                onChange={onDescriptionChange}
                placeholder='Enter course description here'
                name="description"
                rows="7"
                cols="50"            
            />}
            {onEmailChange && <input
                className="input-card-email"
                value={email}
                onChange={onEmailChange}
                name="email"
            />}

            {onRoleChange && <select
                className="input-card-role"
                value={role}
                onChange={onRoleChange}
                name="role">
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                </select>
            }

            <button className="input-card-button" onClick={onPrimaryClick}>{buttonText}</button>
            <button className="input-second-card-button" onClick={onCancelClick}>{secondButtonText}</button>
        </div>
    );
}