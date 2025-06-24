export enum PathEnum {
  Root = "/",
  Perp = "/perp",

  Portfolio = "/portfolio",
  Positions = "/portfolio/positions",
  Orders = "/portfolio/orders",
  FeeTier = "/portfolio/fee",
  ApiKey = "/portfolio/api-key",
  Setting = "/portfolio/setting",
  History = "/portfolio/history",

  Markets = "/markets",
  Leaderboard = "/leaderboard",
  SmartBot = "/smartbot",

  Rewards = "/rewards",
  RewardsTrading = "/rewards/trading",
  RewardsAffiliate = "/rewards/affiliate",
}

export const PageTitleMap = {
  [PathEnum.Portfolio]: "Portfolio",
  [PathEnum.History]: "History",
  [PathEnum.FeeTier]: "Fee tier",
  [PathEnum.ApiKey]: "API keys",
  [PathEnum.Orders]: "Orders",
  [PathEnum.Positions]: "Positions",
  [PathEnum.Setting]: "Settings",
  [PathEnum.Markets]: "Markets",
  [PathEnum.Leaderboard]: "Leaderboard",
  [PathEnum.SmartBot]: "Smart",
  [PathEnum.RewardsTrading]: "Trading Rewards",
  [PathEnum.RewardsAffiliate]: "Affiliate program",
};
