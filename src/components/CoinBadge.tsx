export function CoinBadge({ coins, compact = false }: { coins: number; compact?: boolean }) {
  return (
    <span className={`coin-badge${compact ? ' compact' : ''}`} aria-label={`${coins} coins`}>
      <img src="/aquarium/coin.png" alt="" aria-hidden="true" />
      <strong>{coins.toLocaleString()}</strong>
    </span>
  );
}
