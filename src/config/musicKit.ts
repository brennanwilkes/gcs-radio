import "dotenv/config";
export default {
	musicKitSecret: process.env.MUSIC_KIT_SECRET ? process.env.MUSIC_KIT_SECRET.replace(/\\n/gm, "\n") : process.env.MUSIC_KIT_SECRET,
	musicKitTeamId: process.env.MUSIC_KIT_TEAM_ID,
	musicKitKeyId: process.env.MUSIC_KIT_KEY_ID,
	musicKitTokenExpiry: "1d"
};
