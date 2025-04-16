import "./level.css";
export const Level = (level?: number) => {
    if (!level) return null;

    return (
        <div className="difficulty-section">
            <h3>Livello di difficoltà:</h3>
            <div className="difficulty-stars">
                {[...Array(5)].map((_, i) => (
                    <span
                        key={i}
                        className={`star ${i < level ? 'filled' : ''}`}
                    >
                        {i < level ? '★' : '☆'}
                    </span>
                ))}
            </div>
        </div>
    );
};