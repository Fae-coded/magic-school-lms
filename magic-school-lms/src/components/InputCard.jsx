import './Card.css';

export function InputCard({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
    email,
    onEmailChange,
    role,
    buttonText,
    onPrimaryClick,
    secondButtonText,
    onCancelClick
}) {
    return (
        <div className="card">
            <input
                className="card-title"
                value={title}
                onChange={onTitleChange}
                name="title"
            />
            {description && <textarea
                className="card-content"
                value={description}
                onChange={onDescriptionChange}
                name="description"
            />}
            {email && <input
                className="card-email"
                value={email}
                onChange={onEmailChange}
                name="email"
            />}

            {role && <p
                className="card-role"
                value={role}
                name="role"
            />}

            <button className="card-button" onClick={onPrimaryClick}>{buttonText}</button>
            <button className="second-card-button" onClick={onCancelClick}>{secondButtonText}</button>
        </div>
    );
}

//Option to change a default student user to a teacher - checkbox or something else?