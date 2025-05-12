export function Cell({ value, onCellClick, disabled, className }) {
  return (
    <button className={className} onClick={onCellClick} disabled={disabled}>
      {value}
    </button>
  );
}
