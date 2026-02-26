import './Card.css';

export function Card({
    title,
    description,
    username,
    email,
    roleText,
    buttonText,
    secondButtonText,
    onButtonClick,
    onSecondButtonClick,
    buttonDisabled
}) {
    return (
        <div className="card">
            {title &&
            (<h2 className="card-title">{title}</h2>)}

            {username && (
                <p className="card-username">{username}</p>
            )}

            <button className={`card-button ${buttonDisabled ? 'card-button--enrolled' : ''}`} 
            onClick = {onButtonClick}
            disabled={buttonDisabled} >{buttonText} </button>

            {description && (
                <p className="card-description">{description}</p>
            )}

            {email && (
                <p className="card-email">{email}</p>
            )}

            {secondButtonText && onSecondButtonClick && (
                <button className="second-card-button" onClick = {onSecondButtonClick} >{secondButtonText}</button>)}

            {roleText && (
                <p className="card-role">{roleText}</p>
            )}
            
            
        </div>
    );
}