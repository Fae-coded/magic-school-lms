import './Card.css';

export function Card({
    title,
    description,
    roleText,
    buttonText,
    secondButtonText,
    onButtonClick,
    onSecondButtonClick,
    buttonDisabled
}) {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <p className="card-content">{description}</p>
            {roleText && (
                <p className="role-text">{roleText}</p>
            )}
            <button className="card-button" 
            onClick = {onButtonClick}
            disabled={buttonDisabled} >{buttonText} </button>
            {secondButtonText && onSecondButtonClick && (
                <button className="second-card-button" onClick = {onSecondButtonClick} >{secondButtonText}</button>)}
        </div>
    );
}
// Wrap buttons in a div together for styling?