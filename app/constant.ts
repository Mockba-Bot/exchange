export enum PathEnum {
  Root = "/",
  Perp = "/perp",

  Portfolio = "/portfolio",
  Positions = "/portfolio/positions",
  Orders = "/portfolio/orders",
  FeeTier = "/portfolio/fee",
  ApiKey = "/portfolio/api-key",
  Setting = "/portfolio/setting",

  Markets = "/markets",
  Leaderboard = "/leaderboard",
  TradingBot = "/trading-bot",

  Rewards = "/rewards",
  RewardsTrading = "/rewards/trading",
  RewardsAffiliate = "/rewards/affiliate",
}

export const PageTitleMap = {
  [PathEnum.Portfolio]: "Portfolio",
  [PathEnum.FeeTier]: "Fee tier",
  [PathEnum.ApiKey]: "API keys",
  [PathEnum.Orders]: "Orders",
  [PathEnum.Positions]: "Positions",
  [PathEnum.Setting]: "Settings",
  [PathEnum.Markets]: "Markets",
  [PathEnum.Leaderboard]: "Leaderboard",
  [PathEnum.TradingBot]: "Trading Bot",
  [PathEnum.RewardsTrading]: "Trading Rewards",
  [PathEnum.RewardsAffiliate]: "Affiliate program",
};
