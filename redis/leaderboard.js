const KEY = 'LEADERBOARD';

export const upsertScore = async ({score, username, timetaken}, {redis} ) => {
    //Giving Highest Priority to Score, inflating it's value to have less impact of time taken.
    const modifiedScore = score * 100 - Math.floor(timetaken/10);
    return  redis.zadd(KEY, modifiedScore, username);
}

export const getRankUser = async ({ key, username }, { redis }) => {
    const rank = await redis.zrevrank(key, username);
    if(rank >= 0) return rank + 1;
};

export const getRanks = async ({ key, startIndex, endIndex }, { redis }) => {
    return redis.zrevrange([key, startIndex, endIndex, "WITHSCORES"]);
};

export const totalCount = async ({ key }, { redis }) => {
    return redis.zcard(key);
};


export const getLeaderBoard = async ({ page, perPage, username }, { redis }) => {
    const startIndex = perPage * (page - 1);
    const endIndex = (perPage * page) - 1;
    const [ranks, count, userRank] = await Promise.all([
        getRanks({ key: KEY, startIndex, endIndex }, { redis }),
        totalCount({ key: KEY }, { redis }),
        getRankUser({ key: KEY, username }, { redis })
    ]);
    return {
        ranks: ranks,
        count: count,
        userRank: userRank
    }
}

export default {
    upsertScore,
    getLeaderBoard,
    totalCount,
    getRanks
}