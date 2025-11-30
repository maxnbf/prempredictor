import { Fixture } from "../models/fantasy/fixtureModel";
import { FixturePrediction } from "../models/fantasy/fixturePredictionModel"
import { FantasyRanking } from "../models/fantasy/fantasyRankingModel"
import { UserPoints } from "../models/fantasy/userPointsModel"
import { getRankingService } from "./rankingService";

export async function getFixtures(week, username) {
    const fixtures = await Fixture.find({ week });

    if (fixtures.length === 0) {
        return {
            fixtures: [],
            predictions: []
        };
    }

    // Extract all fixture IDs
    const fixtureIds = fixtures.map(f => f._id);

    // Get predictions by this user for these fixtures
    const predictions = await FixturePrediction.find({
        username,
        fixture: { $in: fixtureIds }
    }).populate("fixture"); // optional: auto-include fixture info

    return {
        fixtures,
        predictions
    };
}

export async function submitPredictions(username, predictions) {
    const savedPredictions = await Promise.all(
        predictions.map(async p => {
            return FixturePrediction.findOneAndUpdate(
                { fixture: p.fixture, username },
                {
                    homeScore: p.homeScore,
                    awayScore: p.awayScore
                },
                { new: true, upsert: true } // create if it doesn't exist
            ).populate("fixture");
        })
    );

    return savedPredictions;
}

export async function getFantasyRanking(username, week) {
    // Try to get existing ranking
    let ranking = await FantasyRanking.findOne({ username, week });

    if (ranking) {
        return ranking;
    }

    // No ranking → try to duplicate week - 1
    const previous = await FantasyRanking.findOne({ username, week: week - 1 });

    if (previous) {
        // Duplicate previous ranking for current week
        ranking = await FantasyRanking.create({
            username,
            ranking: previous.ranking,
            week
        });

        return ranking;
    }

    // No week-1 ranking → fallback to external ranking service
    const generated = await getRankingService(username);

    // Store generated ranking
    ranking = await FantasyRanking.create({
        username,
        ranking: generated.ranking,
        week
    });

    return ranking;
}

export async function submitFantasyRanking(
    username: string,
    teams: string[],
    pointsUsed: number,
    gameweek: number
) {
    const ranking = await FantasyRanking.findOneAndUpdate(
        { username, week: gameweek },
        { ranking: teams },
        { new: true, upsert: true } // create if doesn't exist
    );

    const userPoints = await UserPoints.findOneAndUpdate(
        { username },
        { $inc: { points: -pointsUsed } }, // subtract pointsUsed
        { new: true, upsert: true, setDefaultsOnInsert: true } // create if doesn't exist
    );


    return {
        ranking: ranking.ranking,
        userPoints: userPoints.points
    };
}

export async function getUserPoints(username) {
    const userPoints = await UserPoints.findOne({ username });
    if (userPoints) {
        return userPoints.points
    } else {
        return 0;
    }
    return 0;
}