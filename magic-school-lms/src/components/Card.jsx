import './Card.css';

export function Card({
    title,
    description,
    buttonText
}) {
    return (
        <div className="card">
            <h2 className="card-title">{title}</h2>
            <p className="card-content">{description}</p>
            <button className="card-button">{buttonText}</button>
        </div>
    );
}