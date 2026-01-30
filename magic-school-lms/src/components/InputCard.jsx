import './Card.css';

export function InputCard({
    title,
    onTitleChange,
    description,
    onDescriptionChange,
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
            <textarea
                className="card-content"
                value={description}
                onChange={onDescriptionChange}
                name="description"
            />
            <button className="card-button" onClick={onPrimaryClick}>{buttonText}</button>
            <button className="second-card-button" onClick={onCancelClick}>{secondButtonText}</button>
        </div>
    );
}