import { Request, Response } from "express";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import { mongoose } from "../../../database/connection";
import { print } from "../../util/util";
import { SongObjFromQuery } from "../../../types/song";
import Song from "../../../database/models/song";
import { Voice, VoiceGender } from "../../../types/voiceLine";
import { renderVoiceLineFromTemplate } from "../../voice/renderVoiceLineFromTemplate";
import selectVoiceLine, { selectFirstVoiceLine } from "../../voice/selectVoiceLine";
import { Playlist as PlaylistType } from "../../../types/playlist";
import Playlist, { PlaylistObjFromQuery } from "../../../database/models/playlist";
import uploadVoiceLine from "./uploadVoiceLine";

const postFirstVoiceLine = async (req: Request, res: Response): Promise<void> => {
	const errorHandler = internalErrorHandler(req, res);

	const id = String(req.query.firstId);
	const voice = (req.query.voice ?? Voice.DEFAULT) as Voice;

	const songRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(id) }).catch(errorHandler);
	if (songRes) {
		const song = new SongObjFromQuery(songRes);
		print(`Handling request for first VoiceLine ${song.title} with ${voice}`);

		selectFirstVoiceLine().then(template => {
			return renderVoiceLineFromTemplate(template, song, song, undefined, voice);
		}).then(render => {
			uploadVoiceLine(render, req, res, errorHandler, `first VoiceLine ${song.title} with ${voice}`);
		}).catch(errorHandler);
	}
};

const getPlaylistFromId = async (id: string | undefined, errorHandler: (err: string) => void) => {
	let playlist: PlaylistType | undefined;
	if (id) {
		const res = await Playlist.findOne({ _id: new mongoose.Types.ObjectId(id) }).catch(errorHandler);
		if (res) {
			const obj = PlaylistObjFromQuery(res);
			if (obj) {
				playlist = obj;
			}
		}
	}
	return playlist;
};
const postRegularVoiceLine = async (req: Request, res: Response): Promise<void> => {
	const errorHandler = internalErrorHandler(req, res);

	const hasSpotify = (!!req.cookies.sat) && (!!req.cookies.srt);

	const prevId = String(req.query.prevId);
	const nextId = String(req.query.nextId);
	const voice = (req.query.voice ?? Voice.DEFAULT) as Voice;
	const gender = (req.query.gender ?? VoiceGender.DEFAULT) as VoiceGender;

	const playlistId = req.query.playlist ? String(req.query.playlist) : undefined;
	const playlist = await getPlaylistFromId(playlistId, errorHandler);

	const prevRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(prevId) }).catch(errorHandler);
	const nextRes = await Song.findOne({ _id: new mongoose.Types.ObjectId(nextId) }).catch(errorHandler);
	if (nextRes && prevRes) {
		const prevSong = new SongObjFromQuery(prevRes);
		const nextSong = new SongObjFromQuery(nextRes);
		print(`Handling request for VoiceLine ${prevSong.title} -> ${nextSong.title} with ${voice}`);

		selectVoiceLine(prevSong, nextSong, playlist, hasSpotify).then(template => {
			return renderVoiceLineFromTemplate(template, prevSong, nextSong, playlist, voice, gender);
		}).then(render => {
			uploadVoiceLine(render, req, res, errorHandler, `VoiceLine ${prevSong.title} -> ${nextSong.title} with ${voice}`);
		}).catch(errorHandler);
	}
};

export default async (req: Request, res: Response): Promise<void> => {
	if (req.query.firstId) {
		postFirstVoiceLine(req, res);
	} else {
		postRegularVoiceLine(req, res);
	}
};
