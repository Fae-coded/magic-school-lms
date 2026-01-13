// CardContainer component to hold multiple Card components
import { Card } from './Card.jsx';


export function CardContainer({ containerTitle, children }) {
  return (
    <div className="card-container">
        <h1 className="container-title">{containerTitle}</h1>
        {children}        
    </div>
  );
}