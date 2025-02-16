import seedrandom from "seedrandom";

export default function handler(req, res) {
  const rng = seedrandom("fixed-seed-for-demo");

  // Helper to generate a random Solana wallet address (44-character Base58)
  const generateWalletAddress = () => {
    const alphabet =
      "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    const length = 44;
    let address = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(rng() * alphabet.length);
      address += alphabet[randomIndex];
    }
    return address;
  };

  // Helper to generate one token object.
  const generateToken = () => {
    const tradeTime = Math.floor(rng() * 1440); // minutes ago
    const marketCap = 200000 + Math.floor(rng() * 600000); // between 200K and 800K
    const invested = 5 + rng() * 10;
    const realizedPnlSol = parseFloat((5 + rng() * 100).toFixed(1)); // 5 to 105 SOL
    const buyTransactions = 2 + Math.floor(rng() * 3);
    const sellTransactions = 1 + Math.floor(rng() * 3);
    const holding = parseFloat((rng() * 50).toFixed(1));
    const avgBuy = parseFloat((marketCap * (0.01 + rng() * 0.05)).toFixed(0));
    const avgSell = parseFloat((marketCap * (0.01 + rng() * 0.05)).toFixed(0));
    const held = Math.floor(rng() * 600) + 10;
    return {
      tokenPicture: "orangie.png",
      tokenName: "Token " + generateToken.counter++,
      tokenAddress: generateWalletAddress(),
      tradeTime,
      marketCap,
      invested,
      realizedPnlSol,
      buyTransactions,
      sellTransactions,
      holding,
      avgBuy,
      avgSell,
      held,
    };
  };
  generateToken.counter = 1;

  const traders = Array.from({ length: 100 }).map((_, i) => {
    const index = i + 1;
    const followers = 5000 + Math.floor(rng() * 300000);

    // For overall trader stats (non-token values)
    const tokensDailyCount = 5 + Math.floor(rng() * 5); // fixed number for daily tokens
    const extraWeeklyCount = 10 + Math.floor(rng() * 10); // weekly total = 20 tokens
    const extraMonthlyCount = 10 + Math.floor(rng() * 20); // monthly total = 40 tokens
    const extraAllTimeCount = 20 + Math.floor(rng() * 40); // allTime total = 80 tokens

    const dailyTokensArray = Array.from({ length: tokensDailyCount }).map(() =>
      generateToken()
    );
    const weeklyExtra = Array.from({ length: extraWeeklyCount }).map(() =>
      generateToken()
    );
    const weeklyTokensArray = dailyTokensArray.concat(weeklyExtra);
    const monthlyExtra = Array.from({ length: extraMonthlyCount }).map(() =>
      generateToken()
    );
    const monthlyTokensArray = weeklyTokensArray.concat(monthlyExtra);
    const allTimeExtra = Array.from({ length: extraAllTimeCount }).map(() =>
      generateToken()
    );
    const allTimeTokensArray = monthlyTokensArray.concat(allTimeExtra);

    // Overall tokens count for timeframes:
    const tokensDaily = dailyTokensArray.length;
    const tokensWeekly = weeklyTokensArray.length;
    const tokensMonthly = monthlyTokensArray.length;
    const tokensAllTime = allTimeTokensArray.length;

    const avgBuySolDaily = 5 + rng() * 10;
    const avgEntryDaily = 100000 + Math.floor(rng() * 150000);
    const avgHoldMinutesDaily = 5 + Math.floor(rng() * 300);
    const realizedPnlSolDaily = 10 + rng() * 20;
    const tradeTime = Math.floor(rng() * 1440);

    const winningTradesDaily = Math.floor(rng() * 10);
    const losingTradesDaily = 3 + Math.floor(rng() * 10);
    const totalDaily = winningTradesDaily + losingTradesDaily;
    const winRateDaily =
      totalDaily > 0 ? Math.round((winningTradesDaily / totalDaily) * 100) : 0;
    const winningTradesWeekly = winningTradesDaily * 3;
    const losingTradesWeekly = losingTradesDaily * 3;
    const totalWeekly = winningTradesWeekly + losingTradesWeekly;
    const winRateWeekly =
      totalWeekly > 0
        ? Math.round((winningTradesWeekly / totalWeekly) * 100)
        : 0;
    const winningTradesMonthly = winningTradesDaily * 6;
    const losingTradesMonthly = losingTradesDaily * 6;
    const totalMonthly = winningTradesMonthly + losingTradesMonthly;
    const winRateMonthly =
      totalMonthly > 0
        ? Math.round((winningTradesMonthly / totalMonthly) * 100)
        : 0;
    const winningTradesAllTime = winningTradesDaily * 20;
    const losingTradesAllTime = losingTradesDaily * 20;
    const totalAllTime = winningTradesAllTime + losingTradesAllTime;
    const winRateAllTime =
      totalAllTime > 0
        ? Math.round((winningTradesAllTime / totalAllTime) * 100)
        : 0;

    const totalInvestedDaily = parseFloat(
      (tokensDaily * avgBuySolDaily * 0.8).toFixed(1)
    );

    return {
      profilePhoto: "orangie.png",
      followers,
      twitterHandle: "handle" + index,
      traderName: "trader " + index,
      traderWallet: generateWalletAddress(),
      tradeTime,
      timeframes: {
        daily: {
          tokens: tokensDaily,
          winRate: winRateDaily,
          winningTrades: winningTradesDaily,
          losingTrades: losingTradesDaily,
          avgBuySol: parseFloat(avgBuySolDaily.toFixed(1)),
          avgEntry: avgEntryDaily,
          avgHoldMinutes: avgHoldMinutesDaily,
          realizedPnlSol: parseFloat(realizedPnlSolDaily.toFixed(1)),
          totalInvested: totalInvestedDaily,
        },
        weekly: {
          tokens: tokensWeekly,
          winRate: winRateWeekly,
          winningTrades: winningTradesWeekly,
          losingTrades: losingTradesWeekly,
          avgBuySol: parseFloat(avgBuySolDaily.toFixed(1)),
          avgEntry: avgEntryDaily + 1000,
          avgHoldMinutes: avgHoldMinutesDaily + 5,
          realizedPnlSol: parseFloat((realizedPnlSolDaily + 5).toFixed(1)),
          totalInvested: Math.round(totalInvestedDaily * 2),
        },
        monthly: {
          tokens: tokensMonthly,
          winRate: winRateMonthly,
          winningTrades: winningTradesMonthly,
          losingTrades: losingTradesMonthly,
          avgBuySol: parseFloat(avgBuySolDaily.toFixed(1)),
          avgEntry: avgEntryDaily + 2000,
          avgHoldMinutes: avgHoldMinutesDaily + 10,
          realizedPnlSol: parseFloat((realizedPnlSolDaily + 10).toFixed(1)),
          totalInvested: Math.round(totalInvestedDaily * 3.5),
        },
        allTime: {
          tokens: tokensAllTime,
          winRate: winRateAllTime,
          winningTrades: winningTradesAllTime,
          losingTrades: losingTradesAllTime,
          avgBuySol: parseFloat(avgBuySolDaily.toFixed(1)),
          avgEntry: avgEntryDaily + 3000,
          avgHoldMinutes: avgHoldMinutesDaily + 15,
          realizedPnlSol: parseFloat((realizedPnlSolDaily + 15).toFixed(1)),
          totalInvested: Math.round(totalInvestedDaily * 5),
        },
      },
      tokens: {
        daily: dailyTokensArray,
        weekly: weeklyTokensArray,
        monthly: monthlyTokensArray,
        allTime: allTimeTokensArray,
      },
    };
  });

  res.status(200).json({ traders });
}
