// CardContainer component to hold multiple Card components
import './CardContainer.css';


export function CardContainer({ containerTitle, children }) {
  return (
    <>
    <h1 className="container-title">{containerTitle}</h1>
    <div className="card-container">
        {children}        
    </div>
    </>
  );
}