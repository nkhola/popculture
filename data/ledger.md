# The Ledger

Single source of truth for the whole site. Everything on nkhola.github.io/popculture is generated
from this file. Edit it by hand, run the build, push. Nothing else needs touching.

## How an entry works

Every entry starts with `## Title` and is followed by `key: value` lines in any order.
Unknown keys are ignored, missing keys are fine. Blank line ends the entry.

    kind      film | tv | book                      (required)
    region    indian | world                        (required)
    by        director, author, creator
    year      release / publication year
    status    now | done | shelf
                now   = currently watching or reading, shows on the front page
                done  = finished
                shelf = owned or queued, not started yet
    must      yes | no                              (membership of Must Watch / Must Read)
    rating    essential | strong | decent | unrated
    tags      comma separated, drives all browsing and grouping
    imdb      filled by fetch_scores.py, do not hand edit unless you want to
    rt        filled by fetch_scores.py
    mc        filled by fetch_scores.py
    art       filled by fetch_art.py
    note      your review. One line in the file, as long as you like.
    flag      anything you want to correct later. Renders nowhere, greps easily.

Ratings are a three point scale on purpose. Since almost everything here was chosen
deliberately, `decent` is the floor, not the middle.

    essential   the reason the site exists
    strong      genuinely good, recommend without hesitation
    decent      watchable, readable, not a waste, not a landmark
    unrated     not consumed yet, or no opinion recorded

Every `note:` below is a placeholder written in your voice. Overwrite freely.

---

# CINEMA / WORLD

## Se7en
kind: film
region: world
by: David Fincher
year: 1995
status: done
must: yes
rating: essential
tags: fincher, thriller, neo-noir, serial-killer, 90s, bleak
note: The ending is still the most ruthless thing a studio has ever let through, and nothing since has earned its darkness half as honestly. Fincher invented his entire visual grammar here, all rain and rot and things you only half see.
art: img/art/se7en-david-fincher.jpg
imdbid: tt0114369

## Fight Club
kind: film
region: world
by: David Fincher
year: 1999
status: done
must: yes
rating: essential
tags: fincher, satire, cult, 90s, unreliable-narrator
note: Everyone quotes it for the wrong reasons, which is sort of the joke and sort of the tragedy. Watch it again past thirty and it stops being cool and starts being sad, which is the better film.
art: img/art/fight-club-david-fincher.jpg
imdbid: tt0137523

## Zodiac
kind: film
region: world
by: David Fincher
year: 2007
status: done
must: yes
rating: essential
tags: fincher, thriller, procedural, obsession, true-crime
note: A film about the case never closing, so of course it refuses to close. Probably his best, and the one people skip because there is no payoff, which is the entire point.
art: img/art/zodiac-david-fincher.jpg
imdbid: tt0443706

## The Social Network
kind: film
region: world
by: David Fincher
year: 2010
status: done
must: yes
rating: essential
tags: fincher, drama, tech, sorkin, dialogue
note: Dialogue at a hundred miles an hour and every single line lands. Aged into a documentary without changing a frame.
art: img/art/the-social-network-david-fincher.jpg
imdbid: tt1285016

## Gone Girl
kind: film
region: world
by: David Fincher
year: 2014
status: done
must: yes
rating: strong
tags: fincher, thriller, marriage, twist
note: The nastiest film ever made about marriage and it is having a great time being nasty. That mid film turn is structurally perfect.
art: img/art/gone-girl-david-fincher.jpg
imdbid: tt2267998

## The Girl with the Dragon Tattoo
kind: film
region: world
by: David Fincher
year: 2011
status: done
must: no
rating: strong
tags: fincher, thriller, remake, procedural, cold
note: A remake nobody asked for that turned out better than it had any right to be. Freezing, methodical, and that title sequence is its own short film.
art: img/art/the-girl-with-the-dragon-tattoo-david-fincher.jpg
imdbid: tt1568346

## Panic Room
kind: film
region: world
by: David Fincher
year: 2002
status: done
must: no
rating: strong
tags: fincher, thriller, single-location, craft
note: One house, one night, and a camera that goes wherever it likes. Minor Fincher, but minor Fincher is still better built than most people's best.
art: img/art/panic-room-david-fincher.jpg
imdbid: tt0258000

## The Game
kind: film
region: world
by: David Fincher
year: 1997
status: done
must: no
rating: strong
tags: fincher, thriller, paranoia, 90s
note: Works completely the first time and collapses a little if you think too hard afterwards. Worth it for the ride and for Douglas slowly coming apart.
art: img/art/the-game-david-fincher.jpg
imdbid: tt0119174

## Alien 3
kind: film
region: world
by: David Fincher
year: 1992
status: done
must: no
rating: decent
tags: fincher, sci-fi, horror, troubled-production
note: The studio broke it before he ever finished it, and you can see the better film underneath. The bleak monastery-in-space idea deserved a director with final cut.
art: img/art/alien-3-david-fincher.jpg
imdbid: tt0103644

## The Curious Case of Benjamin Button
kind: film
region: world
by: David Fincher
year: 2008
status: done
must: no
rating: decent
tags: fincher, drama, fantasy, prestige
note: Beautiful and strangely weightless, like an award ceremony that lasts three hours. The one Fincher where the technique is doing all the feeling for you.
art: img/art/the-curious-case-of-benjamin-button-david-fincher.jpg
imdbid: tt0421715

## Mank
kind: film
region: world
by: David Fincher
year: 2020
status: done
must: no
rating: decent
tags: fincher, drama, black-and-white, hollywood, slow
note: The black and white Gary Oldman one, and the only Fincher I would call boring. A film made for his father rather than for anybody watching.
art: img/art/mank-david-fincher.jpg
imdbid: tt10618286

## The Killer
kind: film
region: world
by: David Fincher
year: 2023
status: done
must: no
rating: strong
tags: fincher, thriller, hitman, process
note: Two hours of a man being extremely good at a job while narrating nonsense to himself. The gap between what he says and what he does is the whole film.
art: img/art/the-killer-david-fincher.jpg
imdbid: tt1136617

## Mulholland Drive
kind: film
region: world
by: David Lynch
year: 2001
status: done
must: yes
rating: essential
tags: lynch, surreal, mystery, hollywood, dream-logic
note: The best film ever made about wanting something so badly you rewrite reality to get it. Do not try to solve it on the first pass, just let it happen to you.
art: img/art/mulholland-drive-david-lynch.jpg
imdbid: tt0166924

## Lost Highway
kind: film
region: world
by: David Lynch
year: 1997
status: done
must: yes
rating: essential
tags: lynch, surreal, neo-noir, identity, dread
note: A Mobius strip about guilt where the man literally becomes somebody else rather than admit what he did. That video tape sequence is the most frightening thing Lynch ever shot.
art: img/art/lost-highway-david-lynch.jpg
imdbid: tt0116922

## The Departed
kind: film
region: world
by: Martin Scorsese
year: 2006
status: done
must: yes
rating: essential
tags: scorsese, crime, thriller, remake, boston
note: A remake of Infernal Affairs that is louder, meaner and somehow better paced than the original. Everybody in it is lying and every scene is a rat looking for a rat.
art: img/art/the-departed-martin-scorsese.jpg
imdbid: tt0407887

## Shutter Island
kind: film
region: world
by: Martin Scorsese
year: 2010
status: done
must: yes
rating: strong
tags: scorsese, thriller, psychological, twist, gothic
note: Scorsese doing full gothic horror and clearly enjoying himself. The last line is the whole film and it reframes everything you just sat through.
art: img/art/shutter-island-martin-scorsese.jpg
imdbid: tt1130884

## Reservoir Dogs
kind: film
region: world
by: Quentin Tarantino
year: 1992
status: done
must: yes
rating: strong
tags: tarantino, crime, heist, dialogue, debut, 90s
note: A heist film that never shows the heist, made for the price of a decent car. You can hear a whole decade of cinema starting in the opening diner scene.
art: img/art/reservoir-dogs-quentin-tarantino.jpg
imdbid: tt0105236

## Pulp Fiction
kind: film
region: world
by: Quentin Tarantino
year: 1994
status: done
must: yes
rating: essential
tags: tarantino, crime, nonlinear, dialogue, 90s, formative
note: Rearranged what I thought a film was allowed to do with time. Still the high water mark for making people talking in a room more tense than a shootout.
art: img/art/pulp-fiction-quentin-tarantino.jpg
imdbid: tt0110912

## Jackie Brown
kind: film
region: world
by: Quentin Tarantino
year: 1997
status: done
must: yes
rating: strong
tags: tarantino, crime, elmore-leonard, slow-burn, blaxploitation
note: His most patient and most adult film, and the one that will age best. Pam Grier carries an entire con on her face in the mall sequence.
art: img/art/jackie-brown-quentin-tarantino.jpg
imdbid: tt0119396

## Kill Bill Vol. 1
kind: film
region: world
by: Quentin Tarantino
year: 2003
status: done
must: yes
rating: strong
tags: tarantino, revenge, martial-arts, stylized, anime
note: Pure style with the throttle stuck open, and the anime detour is the best part. The House of Blue Leaves fight is choreography as showing off, in the good way.
art: img/art/kill-bill-vol-1-quentin-tarantino.jpg
imdbid: tt0266697

## Kill Bill Vol. 2
kind: film
region: world
by: Quentin Tarantino
year: 2004
status: done
must: yes
rating: strong
tags: tarantino, revenge, western, dialogue, slow-burn
note: The talking half, and the better half. Pai Mei and the Superman speech justify the whole two film gamble.
art: img/art/kill-bill-vol-2-quentin-tarantino.jpg
imdbid: tt0378194

## Death Proof
kind: film
region: world
by: Quentin Tarantino
year: 2007
status: done
must: no
rating: decent
tags: tarantino, grindhouse, car-chase, pastiche
note: Half of it is people chatting in a bar and half of it is the best car stunt of the century. Lopsided on purpose, still lopsided.
art: img/art/death-proof-quentin-tarantino.jpg
imdbid: tt1028528

## Inglourious Basterds
kind: film
region: world
by: Quentin Tarantino
year: 2009
status: done
must: yes
rating: essential
tags: tarantino, war, revisionist, suspense, multilingual
note: That opening farmhouse scene is a masterclass in stretching a conversation until it snaps. Landa is the best villain he ever wrote and it is not close.
art: img/art/inglourious-basterds-quentin-tarantino.jpg
imdbid: tt0361748

## Django Unchained
kind: film
region: world
by: Quentin Tarantino
year: 2012
status: done
must: yes
rating: strong
tags: tarantino, western, revenge, revisionist
note: A spaghetti western aimed straight at American history with no interest in being polite about it. Runs long in the last act but the dinner table scene earns the ticket.
art: img/art/django-unchained-quentin-tarantino.jpg
imdbid: tt1853728

## The Hateful Eight
kind: film
region: world
by: Quentin Tarantino
year: 2015
status: done
must: no
rating: strong
tags: tarantino, western, single-location, whodunit, snow
note: A locked room mystery shot in 70mm, which is a joke only he would commit to. Slow, mean, and better on a rewatch when you stop waiting for it to move.
art: img/art/the-hateful-eight-quentin-tarantino.jpg
imdbid: tt3460252

## Once Upon a Time in Hollywood
kind: film
region: world
by: Quentin Tarantino
year: 2019
status: done
must: yes
rating: strong
tags: tarantino, hollywood, hangout, revisionist, 60s
note: A hangout film about being washed up, and then the ending arrives like a slap. The most affectionate thing he has made.
art: img/art/once-upon-a-time-in-hollywood-quentin-tarantino.jpg
imdbid: tt7131622

## True Romance
kind: film
region: world
by: Tony Scott
year: 1993
status: done
must: yes
rating: essential
tags: tarantino-written, crime, romance, 90s, cult
note: Tarantino's script with Tony Scott's heart on top, which turns out to be the perfect trade. The Hopper and Walken scene is the best five minutes either of them ever had.
art: img/art/true-romance-tony-scott.jpg
imdbid: tt0108399

## Nightcrawler
kind: film
region: world
by: Dan Gilroy
year: 2014
status: done
must: yes
rating: essential
tags: thriller, media, sociopath, la-noir, formative
note: One of the few films that genuinely got under my skin and stayed there. Gyllenhaal plays a man with no inside, and the film is smart enough never to explain him.
art: img/art/nightcrawler-dan-gilroy.jpg
imdbid: tt2872718

## Fargo
kind: film
region: world
by: Joel Coen, Ethan Coen
year: 1996
status: done
must: yes
rating: essential
tags: coens, crime, black-comedy, snow, 90s, formative
note: Everybody is polite and everybody is doomed, and the film finds that hilarious right up until it does not. Marge is the only decent person in it and she wins by simply doing her job.
art: img/art/fargo-joel-coen-ethan-coen.jpg
imdbid: tt0116282

## Obsession
kind: film
region: world
by: Brian De Palma
year: 1976
status: done
must: no
rating: strong
tags: de-palma, thriller, hitchcockian, 70s, recent-watch
flag: confirm this is the De Palma 1976 one and not a different Obsession
note: De Palma doing Vertigo without pretending otherwise, and the Herrmann score does most of the heavy lifting. Silly if you look at the plot straight on, hypnotic if you do not.
art: img/art/obsession-brian-de-palma.jpg
imdbid: tt0074991

## Searching
kind: film
region: world
by: Aneesh Chaganty
year: 2018
status: done
must: yes
rating: essential
tags: thriller, screenlife, mystery, family, technical
note: Technically brilliant and emotionally tense, told entirely through screens without ever feeling like a gimmick. The format should not work this well and it does.
art: img/art/searching-aneesh-chaganty.jpg
imdbid: tt7668870

## Baby Driver
kind: film
region: world
by: Edgar Wright
year: 2017
status: done
must: yes
rating: essential
tags: edgar-wright, heist, music, visual-storytelling, editing
note: Visual storytelling at the highest level, every cut married to the beat. Wright showing off and earning every second of it.
art: img/art/baby-driver-edgar-wright.jpg
imdbid: tt3890160

## Shaun of the Dead
kind: film
region: world
by: Edgar Wright
year: 2004
status: done
must: yes
rating: essential
tags: edgar-wright, cornetto-trilogy, comedy, horror, visual-storytelling
note: Wright's visual grammar arriving fully formed, with the jokes built into the cuts rather than the lines. Funnier on the fourth watch once you start noticing the setups.
art: img/art/shaun-of-the-dead-edgar-wright.jpg
imdbid: tt0365748

## Hot Fuzz
kind: film
region: world
by: Edgar Wright
year: 2007
status: done
must: yes
rating: essential
tags: edgar-wright, cornetto-trilogy, comedy, action, visual-storytelling
note: An action parody that is a better action film than the ones it parodies. The editing does more of the comedy than the script does.
art: img/art/hot-fuzz-edgar-wright.jpg
imdbid: tt0425112

## The World's End
kind: film
region: world
by: Edgar Wright
year: 2013
status: done
must: yes
rating: essential
tags: edgar-wright, cornetto-trilogy, comedy, sci-fi, visual-storytelling
note: The last Cornetto and the saddest of the three, which sneaks up on you. Same visual precision, much heavier heart.
art: img/art/the-world-s-end-edgar-wright.jpg
imdbid: tt1213663

## John Wick
kind: film
region: world
by: Chad Stahelski
year: 2014
status: done
must: no
rating: strong
tags: action, john-wick, choreography, revenge, gun-fu
note: Brilliant action, choreographed so you can actually see it, which almost nobody bothers with anymore. Thin on everything else and it does not matter.
art: img/art/john-wick-chad-stahelski.jpg
imdbid: tt2911666

## John Wick: Chapter 2
kind: film
region: world
by: Chad Stahelski
year: 2017
status: done
must: no
rating: strong
tags: action, john-wick, choreography, sequel, gun-fu
note: Bigger, and the world building starts getting silly in the right way. Still the cleanest action shooting around.
art: img/art/john-wick-chapter-2-chad-stahelski.jpg
imdbid: tt4425200

## John Wick: Chapter 3 - Parabellum
kind: film
region: world
by: Chad Stahelski
year: 2019
status: done
must: no
rating: strong
tags: action, john-wick, choreography, sequel, gun-fu
note: The horse sequence and the knife room justify the whole film. Plot is now openly an excuse and everybody involved knows it.
art: img/art/john-wick-chapter-3-parabellum-chad-stahelski.jpg
imdbid: tt6146586

## John Wick: Chapter 4
kind: film
region: world
by: Chad Stahelski
year: 2023
status: done
must: no
rating: strong
tags: action, john-wick, choreography, sequel, gun-fu
note: Three hours of set pieces and the stairs sequence alone is worth the ticket. The best looking of the four.
art: img/art/john-wick-chapter-4-chad-stahelski.jpg
imdbid: tt10366206


---

# CINEMA / INDIA

## Iratta
kind: film
region: indian
by: Rohit M. G. Krishnan
year: 2023
status: done
must: yes
rating: essential
tags: malayalam, thriller, crime, police, twins, slow-burn, recent-watch
note: Two brothers, one uniform, and a film that refuses to raise its voice even once. Malayalam cinema doing in two hours what Hindi thrillers cannot manage in three.
art: img/art/iratta-rohit-m-g-krishnan.jpg
imdbid: tt25406500

## Titli
kind: film
region: indian
by: Kanu Behl
year: 2014
status: done
must: yes
rating: essential
tags: hindi, crime, family, realism, delhi, brutal, recent-watch
note: The most honest film about an Indian family I have seen, and it is horrifying. No score, no relief, just people trapped in a house doing damage to each other.
art: img/art/titli-kanu-behl.jpg
imdbid: tt3019620

## Ratsasan
kind: film
region: indian
by: Ram Kumar
year: 2018
status: done
must: yes
rating: essential
tags: tamil, thriller, serial-killer, procedural, original
note: Watch the Tamil original, the remakes all sanded off the edges. Genuinely tense, properly plotted, and it does not cheat you at the reveal.
art: img/art/ratsasan-ram-kumar.jpg
imdbid: tt7060344

## Drishyam
kind: film
region: indian
by: Jeethu Joseph
year: 2013
status: done
must: yes
rating: essential
tags: malayalam, thriller, family, original, perfect-plot
note: The original Malayalam one, everything after is a photocopy. A perfect machine of a script where an ordinary man out-thinks the entire police force using only what he already knew.
art: img/art/drishyam-jeethu-joseph.jpg
imdbid: tt3417422

## Drishyam 2
kind: film
region: indian
by: Jeethu Joseph
year: 2021
status: done
must: yes
rating: strong
tags: malayalam, thriller, sequel, original, slow-burn
note: A sequel nobody needed that justified itself completely, which almost never happens. Spends an hour on ordinary life before you realise the trap was being built the whole time.
art: img/art/drishyam-2-jeethu-joseph.jpg
imdbid: tt12361178

## Maharaja
kind: film
region: indian
by: Nithilan Swaminathan
year: 2024
status: done
must: no
rating: strong
tags: tamil, thriller, revenge, nonlinear, recent-watch
note: The timeline trick is doing a lot of work but it works, and Vijay Sethupathi is very good at looking like a man holding something in. Wobbles in places, sticks the landing.
art: img/art/maharaja-nithilan-swaminathan.jpg
imdbid: tt26548265

## Thudarum
kind: film
region: indian
by: Tharun Moorthy
year: 2025
status: done
must: no
rating: decent
tags: malayalam, drama, thriller, mohanlal, recent-watch
note: Decent. Mohanlal is excellent and the film around him is only fine, which is a fair trade for two hours.
art: img/art/thudarum-tharun-moorthy.jpg
imdbid: tt31969600

## Dhurandhar
kind: film
region: indian
by: Aditya Dhar
year: 2025
status: done
must: no
rating: strong
tags: hindi, action, spy, recent-watch
note: Part one of two, and a solid two on craft. Goes big when it should go quiet, which is the standard Hindi problem.
art: img/art/dhurandhar-aditya-dhar.jpg
imdbid: tt33014583

## Khosla Ka Ghosla!
kind: film
region: indian
by: Dibakar Banerjee
year: 2006
status: done
must: yes
rating: strong
tags: dibakar, hindi, comedy, satire, delhi, middle-class, realism
note: Good rather than great, a Delhi middle class comedy built out of real people. Anupam Kher's small dignified fury is the best thing in it.
art: img/art/khosla-ka-ghosla-dibakar-banerjee.jpg
imdbid: tt0466460

## Oye Lucky! Lucky Oye!
kind: film
region: indian
by: Dibakar Banerjee
year: 2008
status: done
must: yes
rating: essential
tags: dibakar, hindi, comedy, crime, delhi, class, realism
note: A thief film that is really a class film, and it is funny enough that you barely notice. Paresh Rawal playing three men who are all the same man is the joke of the decade.
art: img/art/oye-lucky-lucky-oye-dibakar-banerjee.jpg
imdbid: tt1292703

## Love Sex Aur Dhokha
kind: film
region: indian
by: Dibakar Banerjee
year: 2010
status: done
must: yes
rating: strong
tags: dibakar, hindi, found-footage, satire, experimental, media
note: Made in 2010 and it predicted the next fifteen years of Indian internet culture. Formally braver than anything Bollywood has attempted since.
art: img/art/love-sex-aur-dhokha-dibakar-banerjee.jpg
imdbid: tt1608777

## Shanghai
kind: film
region: indian
by: Dibakar Banerjee
year: 2012
status: done
must: yes
rating: strong
tags: dibakar, hindi, political, thriller, adaptation, realism
note: A cold, unsentimental political thriller that assumes you are paying attention. Emraan Hashmi is a genuine surprise and the ending refuses to comfort anyone.
art: img/art/shanghai-dibakar-banerjee.jpg
imdbid: tt2072227

## Detective Byomkesh Bakshy!
kind: film
region: indian
by: Dibakar Banerjee
year: 2015
status: done
must: no
rating: strong
tags: dibakar, hindi, detective, period, calcutta, style
note: 1940s Calcutta rendered better than the plot deserves. Overstuffed, and I still want the four sequels we never got.
art: img/art/detective-byomkesh-bakshy-dibakar-banerjee.jpg
imdbid: tt3447364

## Sandeep Aur Pinky Faraar
kind: film
region: indian
by: Dibakar Banerjee
year: 2021
status: done
must: yes
rating: decent
tags: dibakar, hindi, road-movie, class, gender, realism
note: Did not land for me. Interesting on paper, a one in practice.
art: img/art/sandeep-aur-pinky-faraar-dibakar-banerjee.jpg
imdbid: tt7094488

## Black Friday
kind: film
region: indian
by: Anurag Kashyap
year: 2004
status: done
must: yes
rating: essential
tags: kashyap, hindi, crime, true-story, bombay, procedural, realism
note: The best Indian procedural ever made and it took three years to get past the courts. That foot chase through the chawls is the single best sequence in Hindi cinema.
art: img/art/black-friday-anurag-kashyap.jpg
imdbid: tt0400234

## Gulaal
kind: film
region: indian
by: Anurag Kashyap
year: 2009
status: done
must: yes
rating: essential
tags: kashyap, hindi, political, rajasthan, tragedy, piyush-mishra
note: Messy, operatic, furious, and the songs are doing half the storytelling. Piyush Mishra wrote and performed his way into a film that is still underseen.
art: img/art/gulaal-anurag-kashyap.jpg
imdbid: tt1261047

## Dev.D
kind: film
region: indian
by: Anurag Kashyap
year: 2009
status: done
must: yes
rating: essential
tags: kashyap, hindi, adaptation, music, delhi, neon
note: Genre defining and still ahead of its time. Devdas rebuilt for people who find Devdas insufferable, and Amit Trivedi's soundtrack is the actual protagonist.
art: img/art/dev-d-anurag-kashyap.jpg
imdbid: tt1327035

## Ek Hasina Thi
kind: film
region: indian
by: Sriram Raghavan
year: 2004
status: done
must: yes
rating: strong
tags: raghavan, hindi, thriller, revenge, debut, noir
note: A lean revenge thriller with no fat on it, made before anyone knew who Raghavan was. Urmila is genuinely frightening in the back half.
art: img/art/ek-hasina-thi-sriram-raghavan.jpg
imdbid: tt0352314

## Johnny Gaddaar
kind: film
region: indian
by: Sriram Raghavan
year: 2007
status: done
must: yes
rating: essential
tags: raghavan, hindi, neo-noir, heist, homage, twist
note: The purest genre film India has produced, a noir with no interest in a message. Every plan goes wrong in a way you could have predicted and never do.
art: img/art/johnny-gaddaar-sriram-raghavan.jpg
imdbid: tt1077248

## Agent Vinod
kind: film
region: indian
by: Sriram Raghavan
year: 2012
status: done
must: no
rating: decent
tags: raghavan, hindi, spy, action, homage
note: The one that did not come together, though the single take Raabta sequence is worth the price alone. Ambitious in a way that failing is still interesting.
art: img/art/agent-vinod-sriram-raghavan.jpg
imdbid: tt1395025

## Badlapur
kind: film
region: indian
by: Sriram Raghavan
year: 2015
status: done
must: yes
rating: essential
tags: raghavan, hindi, revenge, moral-ambiguity, dark
note: Technically brilliant, and a revenge film where revenge slowly turns the hero into the worse man. Nawazuddin walks off with it and the film knows it.
art: img/art/badlapur-sriram-raghavan.jpg
imdbid: tt3678782

## AndhaDhun
kind: film
region: indian
by: Sriram Raghavan
year: 2018
status: done
must: yes
rating: essential
tags: raghavan, hindi, black-comedy, thriller, twist, pune
note: A black comedy thriller that keeps escalating past the point where any other film would stop. That last shot is an argument you can still have with people.
art: img/art/andhadhun-sriram-raghavan.jpg
imdbid: tt8108198

## Merry Christmas
kind: film
region: indian
by: Sriram Raghavan
year: 2024
status: done
must: no
rating: strong
tags: raghavan, hindi, thriller, one-night, bombay, romance
note: One night, two strangers, and Raghavan patiently doing his thing while everyone waits for a twist. Slower than the marketing promised and better than the reception suggested.
art: img/art/merry-christmas-sriram-raghavan.jpg
imdbid: tt15392282

## Animal
kind: film
region: indian
by: Sandeep Reddy Vanga
year: 2023
status: done
must: no
rating: strong
tags: hindi, action, drama, technical, screenplay, editing
note: Technically brilliant, excelling in screenplay and editing, whatever you make of the rest of it. The craft is not the part that is in question.
art: img/art/animal-sandeep-reddy-vanga.jpg
imdbid: tt13751694

## Dhurandhar 2
kind: film
region: indian
by: Aditya Dhar
year: 2026
status: done
must: no
rating: strong
tags: hindi, action, spy, sequel
note: A bit lengthy, and it spends real time whitewashing demonetisation. Still a two on craft alone.
art: img/art/dhurandhar-2-aditya-dhar.jpg
imdbid: tt39139925

## Laapataa Ladies
kind: film
region: indian
by: Kiran Rao
year: 2023
status: done
must: no
rating: strong
tags: hindi, comedy, family, gentle, rural
note: A nice family friendly film, warmer than it is sharp. Pleasant, well made, and nobody gets hurt.
art: img/art/laapataa-ladies-kiran-rao.jpg
imdbid: tt21626284

## Bareilly Ki Barfi
kind: film
region: indian
by: Ashwiny Iyer Tiwari
year: 2017
status: done
must: no
rating: strong
tags: hindi, comedy, romance, small-town, entertainer
note: A nice entertainer with a light touch and good small town texture. Does exactly what it sets out to do.
art: img/art/bareilly-ki-barfi-ashwiny-iyer-tiwari.jpg
imdbid: tt6967980

## Vicky Donor
kind: film
region: indian
by: Shoojit Sircar
year: 2012
status: done
must: no
rating: strong
tags: hindi, comedy, delhi, entertainer, debut
note: A passtime, and a good natured one. Ayushmann's debut and still one of his easiest films to sit through.
art: img/art/vicky-donor-shoojit-sircar.jpg
imdbid: tt2317337

## Ugly
kind: film
region: indian
by: Anurag Kashyap
year: 2013
status: done
must: no
rating: decent
tags: kashyap, hindi, thriller, bleak
note: Kashyap at his most punishing, and not in a way that earns it. A one, and I have no interest in going back.
art: img/art/ugly-anurag-kashyap.jpg
imdbid: tt2882328


---

# TELEVISION

## Severance
kind: tv
region: world
by: Dan Erickson, Ben Stiller
year: 2022
status: done
must: yes
rating: essential
tags: sci-fi, workplace, mystery, corporate, production-design, all-time
note: The highest rated thing on this entire site. A perfect idea executed with total confidence, where the office satire and the existential horror are the same joke.
art: img/art/severance-dan-erickson-ben-stiller.jpg
imdbid: tt11280740

## Furious
kind: tv
region: world
by: unknown
year: 2025
status: now
must: no
rating: decent
tags: recent-watch, currently-watching
flag: title uncertain, you wrote "fuious". Confirm the show and I will fix the entry.
note: Not bad, kinda mid. Watchable enough to keep going, not good enough to recommend to anybody.
art: img/art/furious-unknown.jpg
imdbid: tt36303968

## The Chestnut Man
kind: tv
region: world
by: Soren Sveistrup
year: 2021
status: done
must: yes
rating: essential
tags: nordic-noir, crime, danish, thriller, must-watch
note: Danish crime at its bleakest and most controlled, which is saying something. Trusts you to keep up rather than explaining itself every ten minutes.
art: img/art/the-chestnut-man-soren-sveistrup.jpg
imdbid: tt10834220

## Mindhunter
kind: tv
region: world
by: Joe Penhall, David Fincher
year: 2017
status: done
must: yes
rating: essential
tags: fincher, crime, procedural, psychology, true-crime, must-watch
note: Two men interviewing killers in rooms, and it is tenser than any chase ever filmed. Fincher's fingerprints are all over the pacing, and cancelling it was a genuine crime.
art: img/art/mindhunter-joe-penhall-david-fincher.jpg
imdbid: tt5290382

## Dept. Q
kind: tv
region: world
by: Scott Frank
year: 2025
status: done
must: yes
rating: essential
tags: crime, procedural, cold-case, scottish, must-watch
note: A cold case unit staffed by the people nobody else wanted, and the show is smart enough to make that the point. Properly plotted, properly acted, no filler.
art: img/art/dept-q-scott-frank.jpg
imdbid: tt27995114

## Black Bird
kind: tv
region: world
by: Dennis Lehane
year: 2022
status: done
must: yes
rating: essential
tags: crime, true-crime, prison, performances, apple-tv, must-watch
note: The two lead performances are the whole thing and both are extraordinary. Hauser in particular does something genuinely unsettling with very little.
art: img/art/black-bird-dennis-lehane.jpg
imdbid: tt4301160

## Sherlock
kind: tv
region: world
by: Mark Gatiss, Steven Moffat
year: 2010
status: done
must: yes
rating: essential
tags: detective, british, visual-storytelling, technical, adaptation, must-watch
note: The technical transitions and the visual storytelling are what make it, not the plots. Text on screen, cuts inside a thought, beautiful imagery doing work that dialogue would have ruined.
art: img/art/sherlock-mark-gatiss-steven-moffat.jpg
imdbid: tt1475582

## Better Call Saul
kind: tv
region: world
by: Vince Gilligan, Peter Gould
year: 2015
status: done
must: yes
rating: essential
tags: crime, prequel, character-study, subtle, gilligan, must-watch
note: Better than Breaking Bad on character work and it is not close. Subtler, slower, and it trusts you to notice things instead of pointing at them.
art: img/art/better-call-saul-vince-gilligan-peter-gould.jpg
imdbid: tt3032476

## Breaking Bad
kind: tv
region: world
by: Vince Gilligan
year: 2008
status: done
must: no
rating: strong
tags: crime, drama, gilligan, transformation
note: Great, but a bit masala, a bit in your face, everything underlined twice in case you missed it. A two next to what came after it.
art: img/art/breaking-bad-vince-gilligan.jpg
imdbid: tt0903747

## Pluribus
kind: tv
region: world
by: Vince Gilligan
year: 2025
status: done
must: no
rating: decent
tags: sci-fi, dystopia, hive-mind, gilligan, slow
note: Interesting concept and great filming, but super slow and it does not come together crisply. Skip it if you want, I would not argue.
art: img/art/pluribus-vince-gilligan.jpg
imdbid: tt22202452

## The Office (UK)
kind: tv
region: world
by: Ricky Gervais, Stephen Merchant
year: 2001
status: done
must: yes
rating: essential
tags: comedy, mockumentary, british, workplace, must-watch
note: Twelve episodes and a special, then it stopped, which is the most British thing about it. Bleaker and more uncomfortable than the American one ever tried to be.
art: img/art/the-office-uk-ricky-gervais-stephen-merchant.jpg
imdbid: tt0290978

## The Office (US)
kind: tv
region: world
by: Greg Daniels
year: 2005
status: done
must: yes
rating: essential
tags: comedy, mockumentary, workplace, rewatchable, must-watch
note: Takes a season to find itself and then becomes the most rewatchable thing on television. Warmer than the original and better for it.
art: img/art/the-office-us-greg-daniels.jpg
imdbid: tt0386676

## Parks and Recreation
kind: tv
region: world
by: Greg Daniels, Michael Schur
year: 2009
status: done
must: yes
rating: essential
tags: comedy, mockumentary, workplace, warm, must-watch
note: The most generous comedy ever made, where the joke is never cruelty. Leslie Knope is the only fictional character I would actually vote for.
art: img/art/parks-and-recreation-greg-daniels-michael-schur.jpg
imdbid: tt1266020

## Seinfeld
kind: tv
region: world
by: Larry David, Jerry Seinfeld
year: 1989
status: done
must: yes
rating: essential
tags: comedy, sitcom, 90s, plotting, must-watch
note: The show about nothing that is actually about how awful everyone is. Thirty years on and the plotting is still tighter than anything current.
art: img/art/seinfeld-larry-david-jerry-seinfeld.jpg
imdbid: tt0098904

## Arrested Development
kind: tv
region: world
by: Mitchell Hurwitz
year: 2003
status: done
must: yes
rating: essential
tags: comedy, sitcom, dense, callback, must-watch
note: Every joke is planted three episodes early and pays off once you have forgotten it. Denser than anything else in the genre.
art: img/art/arrested-development-mitchell-hurwitz.jpg
imdbid: tt0367279

## The Lincoln Lawyer
kind: tv
region: world
by: David E. Kelley, Ted Humphrey
year: 2022
status: done
must: no
rating: strong
tags: legal, procedural, netflix, easy-watch
note: A great passtime when you are multitasking, which is exactly the right use for it. Nothing demanded of you and nothing wasted either.
art: img/art/the-lincoln-lawyer-david-e-kelley-ted-humphrey.jpg
imdbid: tt13833978


---

# BOOKS / WORLD

## Your Erroneous Zones
kind: book
region: world
by: Wayne Dyer
year: 1976
status: now
must: no
rating: unrated
tags: self-help, psychology, classic, currently-reading
note: Currently reading. The famous one, and so far it is blunter than the modern self-help shelf, which is probably why it lasted.
art: img/art/your-erroneous-zones-wayne-dyer.jpg

## Meditations
kind: book
region: world
by: Marcus Aurelius
year: 180
status: done
must: yes
rating: essential
tags: stoicism, philosophy, ancient, recent-read, aphorism
note: A man writing notes to himself with no idea anyone would read them, which is exactly why it works. Reads like advice from someone too tired to lie to you.
art: img/art/meditations-marcus-aurelius.jpg

## The Laws of Human Nature
kind: book
region: world
by: Robert Greene
year: 2018
status: done
must: no
rating: essential
tags: psychology, power, greene, recent-read
note: The same great description of human nature, at more length and with more patience. Greene is very good at this.
art: img/art/the-laws-of-human-nature-robert-greene.jpg

## Ego Is the Enemy
kind: book
region: world
by: Ryan Holiday
year: 2016
status: done
must: no
rating: strong
tags: stoicism, self-help, holiday, recent-read
note: Stoicism repackaged for people who will not read Aurelius directly, and there is no shame in that. Says one thing well and then says it forty more times.
art: img/art/ego-is-the-enemy-ryan-holiday.jpg

## The 48 Laws of Power
kind: book
region: world
by: Robert Greene
year: 1998
status: done
must: no
rating: essential
tags: power, strategy, greene, recent-read, amoral
note: A great description of human nature, which is what it is actually for. Read it as observation, not as instruction.
art: img/art/the-48-laws-of-power-robert-greene.jpg

## Fooled by Randomness
kind: book
region: world
by: Nassim Nicholas Taleb
year: 2001
status: shelf
must: no
rating: unrated
tags: taleb, probability, markets, epistemology, shelf
note: On the shelf. The one everybody says is the best Taleb before he started writing mainly about his enemies.
art: img/art/fooled-by-randomness-nassim-nicholas-taleb.jpg

## Skin in the Game
kind: book
region: world
by: Nassim Nicholas Taleb
year: 2018
status: shelf
must: no
rating: unrated
tags: taleb, ethics, risk, incentives, shelf
note: On the shelf. One good idea that reportedly justifies the whole book, assuming you can tolerate the delivery.
art: img/art/skin-in-the-game-nassim-nicholas-taleb.jpg

## The Little Book of Common Sense Investing
kind: book
region: world
by: John C. Bogle
year: 2007
status: shelf
must: no
rating: unrated
tags: investing, index-funds, finance, shelf
note: On the shelf. Everyone says the entire argument fits on a postcard, which is a point in its favour.
art: img/art/the-little-book-of-common-sense-investing-john-c-bogle.jpg

## Healing Back Pain
kind: book
region: world
by: John E. Sarno
year: 1991
status: shelf
must: no
rating: unrated
tags: sarno, pain, mind-body, health, shelf, tms
note: On the shelf. The origin point for the whole mind-body pain literature that half my shelf now belongs to.
art: img/art/healing-back-pain-john-e-sarno.jpg

## The Body Keeps the Score
kind: book
region: world
by: Bessel van der Kolk
year: 2014
status: shelf
must: no
rating: unrated
tags: trauma, psychology, health, mind-body, shelf
note: On the shelf. The one everybody has recommended to me and nobody has finished.
art: img/art/the-body-keeps-the-score-bessel-van-der-kolk.jpg

## Unlearn Your Pain
kind: book
region: world
by: Howard Schubiner
year: 2010
status: shelf
must: no
rating: unrated
tags: pain, mind-body, health, workbook, shelf, tms
note: On the shelf. More workbook than book, which probably means it only works if you actually do it.
art: img/art/unlearn-your-pain-howard-schubiner.jpg

## The Way Out
kind: book
region: world
by: Alan Gordon
year: 2021
status: shelf
must: no
rating: unrated
tags: pain, mind-body, health, shelf, tms
note: On the shelf. The most recent attempt at the Sarno idea with actual trial data behind it.
art: img/art/the-way-out-alan-gordon.jpg

## Option B
kind: book
region: world
by: Sheryl Sandberg, Adam Grant
year: 2017
status: shelf
must: no
rating: unrated
tags: grief, resilience, psychology, shelf
note: On the shelf. Grief plus research, which could go either very well or very badly.
art: img/art/option-b-sheryl-sandberg-adam-grant.jpg

## No Rules Rules
kind: book
region: world
by: Reed Hastings, Erin Meyer
year: 2020
status: shelf
must: no
rating: unrated
tags: business, culture, management, netflix, shelf
note: On the shelf. Netflix explaining Netflix, so grade the whole thing on a curve.
art: img/art/no-rules-rules-reed-hastings-erin-meyer.jpg

## The Tipping Point
kind: book
region: world
by: Malcolm Gladwell
year: 2000
status: shelf
must: no
rating: unrated
tags: gladwell, pop-social-science, shelf
note: On the shelf. The one that created the entire genre, for better and mostly for worse.
art: img/art/the-tipping-point-malcolm-gladwell.jpg

## Blink
kind: book
region: world
by: Malcolm Gladwell
year: 2005
status: shelf
must: no
rating: unrated
tags: gladwell, pop-social-science, psychology, shelf
note: On the shelf. Snap judgement as a superpower, from before the replication crisis had opinions about that.
art: img/art/blink-malcolm-gladwell.jpg

## Outliers
kind: book
region: world
by: Malcolm Gladwell
year: 2008
status: shelf
must: no
rating: unrated
tags: gladwell, pop-social-science, success, shelf
note: On the shelf. Famous for one number that turned out to be mostly wrong, which is very Gladwell.
art: img/art/outliers-malcolm-gladwell.jpg

## David and Goliath
kind: book
region: world
by: Malcolm Gladwell
year: 2013
status: shelf
must: no
rating: unrated
tags: gladwell, pop-social-science, shelf
note: On the shelf. Underdogs, reframed, at length.
art: img/art/david-and-goliath-malcolm-gladwell.jpg

## Talking to Strangers
kind: book
region: world
by: Malcolm Gladwell
year: 2019
status: shelf
must: no
rating: unrated
tags: gladwell, pop-social-science, psychology, shelf
note: On the shelf. Reportedly his most serious and least fun, which might be the right direction.
art: img/art/talking-to-strangers-malcolm-gladwell.jpg

## The Beginning of Infinity
kind: book
region: world
by: David Deutsch
year: 2011
status: shelf
must: no
rating: unrated
tags: philosophy, science, epistemology, physics, shelf, hard
note: On the shelf. The one book on this list that people describe as actually changing how they think, so it keeps getting postponed.
art: img/art/the-beginning-of-infinity-david-deutsch.jpg

## Essays and Aphorisms
kind: book
region: world
by: Arthur Schopenhauer
year: 1851
status: shelf
must: no
rating: unrated
tags: philosophy, pessimism, essays, shelf
note: On the shelf. Professional pessimism, elegantly done, in small enough pieces to survive.
art: img/art/essays-and-aphorisms-arthur-schopenhauer.jpg

## Assimil: French With Ease
kind: book
region: world
by: Assimil
year: 1986
status: shelf
must: no
rating: unrated
tags: language, french, learning, shelf, course
note: On the shelf, in progress in theory. The method only works if you show up daily, which is the whole problem.
art: img/art/assimil-french-with-ease-assimil.jpg

## In Cold Blood
kind: book
region: world
by: Truman Capote
year: 1966
status: done
must: yes
rating: essential
tags: true-crime, nonfiction-novel, realism, american, masterpiece
note: An absolute masterpiece and the book that invented an entire form. Capote makes you understand the killers without once asking you to forgive them.
art: img/art/in-cold-blood-truman-capote.jpg

## Three Men in a Boat
kind: book
region: world
by: Jerome K. Jerome
year: 1889
status: done
must: yes
rating: strong
tags: comedy, victorian, travel, english, timeless
note: A book from 1889 that is still genuinely funny, which almost nothing manages. Nothing happens, slowly, and it is delightful.
art: img/art/three-men-in-a-boat-jerome-k-jerome.jpg

## Lamb to the Slaughter
kind: book
region: world
by: Roald Dahl
year: 1953
status: done
must: yes
rating: essential
tags: short-story, dahl, crime, twist, dark-comedy
note: The perfect short story and the perfect last line. Everything Dahl learned about cruelty in ten pages.
art: img/art/lamb-to-the-slaughter-roald-dahl.jpg

## Collected Short Stories
kind: book
region: world
by: Saki
year: 1914
status: done
must: yes
rating: essential
tags: short-story, saki, satire, english, dark-comedy, edwardian
note: Read nearly all of them and would happily start again. Cruel, immaculate, and never a wasted sentence. The Open Window and Sredni Vashtar first.
art: img/art/collected-short-stories-saki.jpg

## The Complete Short Stories
kind: book
region: world
by: O. Henry
year: 1906
status: done
must: yes
rating: strong
tags: short-story, o-henry, american, twist, realism
note: The master of the ending you did not see and should have. Formula after a while, but what a formula.
art: img/art/the-complete-short-stories-o-henry.jpg

## The Night We Won the Buick
kind: book
region: world
by: unknown
year: 0
status: done
must: no
rating: strong
tags: short-story, americana
flag: could not place author or year with confidence, fill this in
note: Stuck with me long after I forgot where I found it. Placeholder until you tell me who wrote it.

## Collected Poems
kind: book
region: world
by: Charles Bukowski
year: 1974
status: done
must: no
rating: strong
tags: poetry, bukowski, american, realism, dirty-realism
note: Read nearly all of it. Half of it is a man complaining and the other half is the plainest honest writing anyone has managed about being broke and alive.
art: img/art/collected-poems-charles-bukowski.jpg

## The Fountainhead
kind: book
region: world
by: Ayn Rand
year: 1943
status: done
must: no
rating: decent
tags: fiction, philosophy, objectivism, college-read
note: Read it in college, which is the correct and possibly only time to read it. Compelling for about four hundred pages and then it starts lecturing.
art: img/art/the-fountainhead-ayn-rand.jpg

## Atlas Shrugged
kind: book
region: world
by: Ayn Rand
year: 1957
status: done
must: no
rating: decent
tags: fiction, philosophy, objectivism, college-read, long
note: The other college one. There is a sixty page speech in it and that tells you most of what you need to know.
art: img/art/atlas-shrugged-ayn-rand.jpg

---

# BOOKS / INDIA

## Gunda
kind: book
region: indian
by: Jaishankar Prasad
year: 1932
status: done
must: yes
rating: essential
tags: hindi, short-story, realism, prasad, classic, must-read
note: One of the great Hindi short stories and a definite must read. A thug given a moment of real dignity, written without a shred of sentimentality.

## Poos Ki Raat
kind: book
region: indian
by: Premchand
year: 1930
status: done
must: yes
rating: essential
tags: hindi, short-story, premchand, realism, rural, poverty
note: A farmer, a cold night, and a small surrender that lands like a gut punch. Premchand doing more with a blanket and a field than most novels manage in four hundred pages.
art: img/art/poos-ki-raat-premchand.jpg

## Namak Ka Daroga
kind: book
region: indian
by: Premchand
year: 1925
status: done
must: yes
rating: strong
tags: hindi, short-story, premchand, realism, integrity, favourite
note: Honesty costs the man everything and the story is clear eyed enough to admit that. A two, and still one I go back to.

## Khudai Fojdar
kind: book
region: indian
by: Premchand
year: 1935
status: done
must: yes
rating: essential
tags: hindi, short-story, premchand, realism, satire, favourite
note: The other of my two favourites. Funny and sharp and quietly furious about the same things he was always furious about.

## Godan
kind: book
region: indian
by: Premchand
year: 1936
status: done
must: yes
rating: essential
tags: hindi, novel, premchand, realism, rural, debt, classic
note: The great Hindi novel of rural debt and it never once tips into melodrama. Hori wanting one cow is the whole tragedy of a system in a single want.
art: img/art/godan-premchand.jpg

## Collected Short Stories
kind: book
region: indian
by: Premchand
year: 1936
status: done
must: yes
rating: essential
tags: hindi, short-story, premchand, realism, collection
note: Read nearly all of them and would say the short stories are where he is strongest. Realism with no interest in making you comfortable.

## Midnight's Children
kind: book
region: indian
by: Salman Rushdie
year: 1981
status: done
must: yes
rating: essential
tags: english, novel, magical-realism, partition, rushdie, must-read
note: A must read. History and hallucination sharing one nose, and it earns every trick it pulls.
art: img/art/midnight-s-children-salman-rushdie.jpg

## Shame
kind: book
region: indian
by: Salman Rushdie
year: 1983
status: done
must: yes
rating: essential
tags: english, novel, magical-realism, pakistan, political, rushdie, must-read
note: The other must read Rushdie, meaner and tighter than Midnight's Children. A country rewritten as a family that cannot stop humiliating itself.
art: img/art/shame-salman-rushdie.jpg

## The God of Small Things
kind: book
region: indian
by: Arundhati Roy
year: 1997
status: done
must: yes
rating: essential
tags: english, novel, kerala, caste, family, prose, lyrical
note: The prose does things English is not supposed to allow. Tells you the ending early and it still destroys you when it arrives.
art: img/art/the-god-of-small-things-arundhati-roy.jpg

## The White Tiger
kind: book
region: indian
by: Aravind Adiga
year: 2008
status: done
must: no
rating: strong
tags: english, novel, class, satire, dark, booker
note: A nasty, fast, very funny book about getting out by any means. Thinner than its reputation but it goes down in two sittings.
art: img/art/the-white-tiger-aravind-adiga.jpg

## Cry, the Peacock
kind: book
region: indian
by: Anita Desai
year: 1963
status: done
must: yes
rating: essential
tags: english, novel, psychological, interiority, desai, must-read
note: A must read. All interior, all pressure, a mind coming apart in slow motion with nobody around noticing.
art: img/art/cry-the-peacock-anita-desai.jpg

## Annihilation of Caste
kind: book
region: indian
by: B. R. Ambedkar
year: 1936
status: done
must: yes
rating: essential
tags: nonfiction, political, caste, ambedkar, essential, must-read
note: A must read, and the single clearest piece of argument written in modern India. A speech so unanswerable they cancelled the event rather than hear it.
art: img/art/annihilation-of-caste-b-r-ambedkar.jpg

## The Gene: An Intimate History
kind: book
region: indian
by: Siddhartha Mukherjee
year: 2016
status: done
must: no
rating: strong
tags: nonfiction, science, biology, history, mukherjee
note: Science writing that remembers it is also a family story. Long, and it earns most of the length.
art: img/art/the-gene-an-intimate-history-siddhartha-mukherjee.jpg

## India After Gandhi
kind: book
region: indian
by: Ramachandra Guha
year: 2007
status: shelf
must: no
rating: unrated
tags: nonfiction, history, politics, guha, shelf, long
note: On the shelf. The standard account of the republic, and it is a brick.
art: img/art/india-after-gandhi-ramachandra-guha.jpg

## The Ocean of Churn
kind: book
region: indian
by: Sanjeev Sanyal
year: 2016
status: shelf
must: no
rating: unrated
tags: nonfiction, history, indian-ocean, sanyal, shelf
note: On the shelf. History told from the water rather than the capital, which is a good idea for a book.
art: img/art/the-ocean-of-churn-sanjeev-sanyal.jpg

## Land of the Seven Rivers
kind: book
region: indian
by: Sanjeev Sanyal
year: 2012
status: shelf
must: no
rating: unrated
tags: nonfiction, history, geography, sanyal, shelf
note: On the shelf. Indian history through its rivers and its geography.
art: img/art/land-of-the-seven-rivers-sanjeev-sanyal.jpg

## Atmamun
kind: book
region: indian
by: Kapil Gupta
year: 2016
status: shelf
must: no
rating: unrated
tags: philosophy, spirituality, shelf, contrarian
note: On the shelf. Very short, apparently very blunt, and unusually hostile to its own genre.
art: img/art/atmamun-kapil-gupta.jpg

## Ashtavakra Gita
kind: book
region: indian
by: Ashtavakra
year: 800
status: shelf
must: no
rating: unrated
tags: philosophy, advaita, sanskrit, translation, shelf, ancient
note: On the shelf, in translation. The one that skips the practice and just states the conclusion.
art: 

## The Book of Life
kind: book
region: indian
by: Jiddu Krishnamurti
year: 1995
status: shelf
must: no
rating: unrated
tags: philosophy, krishnamurti, daily-reader, shelf
note: On the shelf. A daily reader, so it is designed to be picked at rather than finished.
art: img/art/the-book-of-life-jiddu-krishnamurti.jpg

---

# TECH SHELF

Stub. Your tech reading lives in posts on khola.blog and is not catalogued anywhere locally.
Give me the list, or point me at a folder, and I will fill this section using the same format.
Until then the site hides this section automatically.
