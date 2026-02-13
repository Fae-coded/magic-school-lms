import './Card.css';

export function Card({
    title,
    description,
    buttonText,
    secondButtonText,
    onButtonClick,
    onSecondButtonClick
}) {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <p className="card-content">{description}</p>
            <button className="card-button" onClick = {onButtonClick} >{buttonText} </button>
            {secondButtonText && onSecondButtonClick && (
                <button className="second-card-button" onClick = {onSecondButtonClick} >{secondButtonText}</button>)}
        </div>
    );
}
// Wrap buttons in a div together for styling?