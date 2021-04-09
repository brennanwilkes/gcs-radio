import { Request, Response } from "express";

import { ConditionAppliesTo, ConditionType, VoiceConditionObj, VoiceLineTemplateAutofill, VoiceLineType, VoiceVariable } from "../../../types/voiceLine";
import internalErrorHandler from "../../errorHandlers/internalErrorHandler";
import RadioServer from "../../server";
import { VoiceLineTemplateModelFromVoiceLineTemplate } from "../../../database/models/voiceLineTemplate";

// This is just a cache of voice line data so that a new GCS Radio database instance can
// be spun up. This controller simply pre-loads the database with VoiceLineTemplate documents.
// Actual voice line requests will query the live database for templates, not pick from here.
const voiceLines = [

	// INTROS
	new VoiceLineTemplateAutofill([], "Welcome to GCS Radio! First up, $NEXT_TITLE by $NEXT_ARTIST", VoiceLineType.intro),
	new VoiceLineTemplateAutofill([], "3. 2. 1. We're live! This is GCS Radio, you're listening to $NEXT_TITLE off of $NEXT_ALBUM", VoiceLineType.intro),
	new VoiceLineTemplateAutofill([], "Welcome back to GCS Radio, starting off is $NEXT_TITLE by $NEXT_ARTIST", VoiceLineType.intro),
	new VoiceLineTemplateAutofill([], "This is GCS Radio, we're going to hop right in with some $NEXT_ARTIST!", VoiceLineType.intro),

	// NORMAL
	new VoiceLineTemplateAutofill([], "You're listening to GCS Radio. Next up we're listening to $NEXT_TITLE by $NEXT_ARTIST", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "You're listening to GCS radio. We just heard $PREV_TITLE, up next, $NEXT_TITLE off of $NEXT_ALBUM", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Incase you forgot, that was $PREV_TITLE by $PREV_ARTIST off of $PREV_ALBUM. Coming up right away, we'll be listening to $NEXT_TITLE", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "If you liked that song you can find it and much more on $PREV_ARTIST's album $PREV_ALBUM. Now on to $NEXT_TITLE", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Did you know that $PREV_ARTIST has 16 a's in their middle name? Yeah they don't.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "And we're back with more $NEXT_ARTIST just for you, right up next it's $NEXT_TITLE", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "You'll be getting a healthy serving of $NEXT_ARTIST tonight, but let's start with some music from $NEXT_ALBUM", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "We're live again in 5. 4. 3. 2. 1. $NEXT_TITLE!", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "The latest hits and the greatest memories on GCS radio live. It's $NEXT_TITLE from $NEXT_ALBUM", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "You've heard it all here on GCS radio. Here's more music by $NEXT_ARTIST. It's $NEXT_TITLE next.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "--and now we're going to play a brand new song, from a brand new artist, named $NEXT_TITLE. go!", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "no listen of GCS radio will ever be complete without an incredible mix of the best music $NEXT_ARTIST has to offer.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "there are dozens of reasons why this music could be here. What's yours? Mine is $NEXT_TITLE by $NEXT_ARTIST", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Once again that was $NEXT_TITLE by $NEXT_ARTIST. You're listening to GCS radio, next up, $NEXT_TITLE", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "I apologize for the late time, time zone crossover created havoc. Next $NEXT_TITLE by $NEXT_ARTIST.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Check out GCS Radio GitLab for more exciting features, I hope you'll join me, there is absolutely no cost to listen to this and I won't try to get to your phone to sell you something. When I listen to music, I listen to it for music's sake. No bad feelings or agenda, just pure music. How can you go wrong with that? Thank you so much for being here, once again, have a great day. Anyway. Back to music. Here's $NEXT_TITLE", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Thank you to all of my GCS Radio followers and listeners for making this such an incredible journey for me and being so patient with me while I get the hang of this Internet radio thing. Your support and well wishes really make a difference, when you really get down to it. Wow. Anyway. Lets get back to the hit tunes. It's $NEXT_TITLE by $NEXT_ARTIST coming your way next", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Great song, great art, and really super talented musicianship! And what a good name. It's $NEXT_TITLE by $NEXT_ARTIST on GCS Radio", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "So here we go! $NEXT_TITLE from $NEXT_ARTIST (oh yeah, 'GIG' still says 'GIG' because I don't like the way the dashes look and I don't want to type them, but I digress)", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "With that, I'll take a break so you can eat, brush your teeth, put on your slippers, and so on, and we can get $NEXT_TITLE by $NEXT_ARTIST on the air next.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Hi everyone! Welcome to another installment of GCS Radio. Today we're gonna be listening to some of the hottest songs from around the world, and we've got $NEXT_TITLE from $NEXT_ARTIST up on the airwaves now.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Look at the screen up there. It has the blurriest version of ME playing, which is what's on your system now. Can you hear the song? Can you even hear me playing it? Can you hear the song at all? No? Isn't that the point, don't be listening to anything if you can't HEAR ME PLAYING THE SONG. THAT IS THE TARGET. That is the ATTEMPT AT SURVIVAL. THAT IS YOU. THAT IS $NEXT_TITLE BY $NEXT_ARTIST.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "What is a piece of artwork? A stage prop or a standard piece of furniture. What is $NEXT_TITLE? A unique piece of original art that has the power to profoundly affect the emotions. What is the theme of this $NEXT_ALBUM by $NEXT_ARTIST? Unique melodies from the deepest psyche of the most alien of humans. Am I safe to talk? Are you there? Can you even HEAR ME PLAYING IT? Go!", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "And now you are experiencing one of the major journeys. You are on a sacred pilgrimage to this sacred land called planet earth. No, your ancestors never came here, but that doesn't matter because this land is now your sacred home. This land is no longer the helpless shell that aliens lived in and you fought for their freedom from. This land has been sanctified by your sacrifice. This land is now your own. Up next, $NEXT_TITLE.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "I am the music. I am the air. I am the moonlight. $NEXT_ARTIST. Look out your window. A fire burns. $NEXT_TITLE off of $NEXT_ALBUM.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Honestly I don't understand this song and I think it should be banned from our radio. Make the new one just $PREV_ARTIST instead", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Don't worry guys we're doing everything we can to get $NEXT_ARTIST on GCS Radio for an interview, but in the mean time here's their song $NEXT_TITLE.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "SPACE's always been a big topic in GCS Radio. Things like opinions on Pluto being classified as a planet, and space, and outer space, all kinds of space stuff... If you're really lucky, that can be brought to air in this mid-show addition. Until then, let's listen to $NEXT_TITLE off of $NEXT_ALBUM by $NEXT_ARTIST", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "The competition is fierce, so let's hear some music by $NEXT_ARTIST", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "These moments that I think are too precious, I should never let them go. Just stay close to me and listen to the stories I tell you. $NEXT_TITLE by $NEXT_ARTIST. GCS Radio.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "LISTEN to $NEXT_TITLE. This song is getting a lot of attention, so tune in to GCS Radio with $NEXT_ARTIST", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Finally you've heard all the songs. That was GCS radio, and have a wonderful day. J K there's no such thing as too much. $NEXT_TITLE next from GCS Radio.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Sometimes you have no idea what you want to hear. You're just sitting there, listening. It's almost like you are the music. The way you move, the music moves you. $NEXT_ARTIST moves you. $NEXT_TITLE off of $NEXT_ALBUM moves you.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "You've heard this song before, probably on the radio. $NEXT_TITLE coming your way!", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "Here at GCS Radio we get exclusive access to the best music on this planet, and so many more! Here's the hottest hits of the next planet over, $NEXT_TITLE", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "The song itself is called $NEXT_TITLE. But wait. Wait, wait, wait. Did you know that this particular song, has been playing on my podcast and in my podcast automation workflow for the past month or so, and I have no idea who the artist is? GCS Radio. $NEXT_TITLE.", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "You're listening to $PLAYLIST_TITLE, $PLAYLIST_DESCRIPTION on GCS Radio!", VoiceLineType.normal),
	new VoiceLineTemplateAutofill([], "$PLAYLIST_TITLE. Hit Music. $PLAYLIST_DESCRIPTION. GCS Radio!", VoiceLineType.normal),

	// PARALLEL
	new VoiceLineTemplateAutofill([], "Next up on GCS Radio, $NEXT_TITLE by $NEXT_ARTIST", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "The best music, right here on GCS radio", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "$PREV_ARTIST, $NEXT_ARTIST, and all the hits on GCS Radio.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "You've heard this one before. GCS Radio ALL DAY LONG!! $NEXT_TITLE on repeat!!", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Whoa! Whoa! Whoa! Whoa! You haven't heard this one. GCS radio next, $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Best song title I have EVER heard! $NEXT_TITLE.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Thank you $NEXT_ARTIST, we absolutely love you!", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "GCS Radio is a join project between me and YOU", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "It's GCS Radio. You're listening to $NEXT_ARTIST, next up, $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Thank you for choosing GCS Radio live. Next up is $NEXT_TITLE.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "GCS Radio is the best, but don't take my word for it, listen to $NEXT_ARTIST.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Next up one of my personal favourites, $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "It's your station, GCS radio live", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "The best $NEXT_ARTIST station on the air, GCS radio live!", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "The songs you want to hear, when you want to hear them, GCS radio live", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Songs you didn't even know you wanted to hear, coming your way", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "The good vibes just keep coming with music from $NEXT_ARTIST up next", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "One of my personal favourites, $PREV_TITLE, great tune.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Oh great, you've been listening to $PREV_ARTIST. You're welcome.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Hit music right now on GCS radio live. $NEXT_TITLE up next!", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "And here's by $NEXT_ARTIST off of their album $NEXT_ALBUM", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Again, in case you forgot, I'm your host, broadcasting live on GCS radio", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "now, $NEXT_ARTIST is a rather sinister looking fellow. Here's his song $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "his name is really $PREV_ARTIST, but everybody calls him $NEXT_ARTIST. It's $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Do you like $NEXT_ARTIST? I hope so, because it's $NEXT_TITLE up next.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Coming up next from $NEXT_ARTIST's album $NEXT_ALBUM, we've got $NEXT_TITLE.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Here at GCS radio we love $NEXT_ARTIST's album $NEXT_ALBUM, so here's $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Here's $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "More $NEXT_ARTIST next", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Enjoying GCS radio? We have plenty more $NEXT_ARTIST to come.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Next, some $NEXT_ARTIST music, we're listening to $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "$PREV_ARTIST's album $PREV_ALBUM has lots of other great tracks on it too.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Another classic from $NEXT_ARTIST, $NEXT_TITLE off of $NEXT_ALBUM", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "I'm your host, broadcasting live on GCS radio.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "That was $PREV_TITLE. Here's $NEXT_TITLE.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "You're listening to GCS radio. Next up, $NEXT_TITLE, by $NEXT_ARTIST.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "That was $PREV_TITLE. Here's $NEXT_TITLE.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "From $PREV_ARTIST we move to the sweet tunes of $NEXT_ARTIST.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "These tunes brought to you by GCS Radio. Coming up next, $NEXT_TITLE", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "You're listening to $PLAYLIST_TITLE on GCS Radio", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "Hit $PLAYLIST_TITLE tunes on GCS Radio", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "$PLAYLIST_TITLE all day on GCS Radio", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "$PLAYLIST_TITLE. All. Day. Long.", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "All the best $PLAYLIST_TITLE on GCS Radio", VoiceLineType.parallel),
	new VoiceLineTemplateAutofill([], "More hits from $PLAYLIST_TITLE coming up next", VoiceLineType.parallel),

	// RSS
	new VoiceLineTemplateAutofill([], "Some news from $RSS_TITLE. $RSS_HEADLINE. Now back to music.", VoiceLineType.rss),
	new VoiceLineTemplateAutofill([], "This just in from $RSS_TITLE, $RSS_HEADLINE, $RSS_DETAILS. Now, back to music, it's $NEXT_TITLE coming up next.", VoiceLineType.rss),
	new VoiceLineTemplateAutofill([], "And an update from $RSS_TITLE, $RSS_HEADLINE, $RSS_DETAILS. Once again that was $RSS_TITLE. You're listening to GCS radio live, here's $NEXT_TITLE by $NEXT_ARTIST", VoiceLineType.rss),
	new VoiceLineTemplateAutofill([], "$RSS_HEADLINE, $RSS_DETAILS. That alert was from $RSS_TITLE, now, straight back to $NEXT_ARTIST. $NEXT_TITLE next on GCS radio live", VoiceLineType.rss),
	new VoiceLineTemplateAutofill([], "That was $PREV_TITLE, we now move on to $RSS_TITLE. $RSS_HEADLINE, $RSS_DETAILS. Now back to what you're here for, here's $NEXT_TITLE off of $NEXT_ALBUM!", VoiceLineType.rss),
	new VoiceLineTemplateAutofill([], "You're listening to GCS Radio live, now some $RSS_TITLE. $RSS_HEADLINE, $RSS_DETAILS. Back to the good stuff, we've got $NEXT_TITLE coming up next.", VoiceLineType.rss),

	// SPECIAL CONDITIONS
	new VoiceLineTemplateAutofill([
		new VoiceConditionObj(ConditionAppliesTo.PREVIOUS, VoiceVariable.title, ConditionType.EQUALS_VAR, VoiceVariable.title),
		new VoiceConditionObj(ConditionAppliesTo.PREVIOUS, VoiceVariable.artist, ConditionType.EQUALS_VAR, VoiceVariable.artist)
	], "$NEXT_SONG by $NEXT_ARTIST is so good we have to play it again!", VoiceLineType.parallel)
];

// This controller is only meant to be activated as part of the
// generateVoiceTemplates dev script
export default (server: RadioServer) => (req: Request, res: Response): void => {
	const processing = voiceLines.map(line => VoiceLineTemplateModelFromVoiceLineTemplate(line).save());
	Promise.all(processing).then(data => {
		res.status(200).send({
			templates: data.map(doc => doc._id)
		});
		server.close();
	}).catch(internalErrorHandler(req, res));
};
