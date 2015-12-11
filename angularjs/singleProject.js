function SingleProjectController($http, $scope, $route, $location) {


    //----------PROJECT STRUCTURES---------------------------
    var blank = [{
        title: "Information not found",
        status: "Information not found",
        linkText: "Information not found",
        linkImage: "",
        link: "Information not found",
        start: "Information not found",
        end: "Information not found",
        event: "Information not found",
        description: [
            "Information not found",
        ],
        images: [
            '/images/temp.png',
        ]
    }];

    var InBetween = [{
        title: "InBetween",
        status: "Published on Google Play Store",
        linkText: "",
        linkImage: "https://developer.android.com/images/brand/en_generic_rgb_wo_60.png",
        link: "https://play.google.com/store/apps/details?id=com.BSU.inbetween",
        start: "Sept 2014",
        end: "Present",
        event: "n/a",
        description: [
            "My first ever released Android application, this app took months of hard work and collaboration to complete. Done as the final project for my Advanced Programming class, myself and 3 other groups memeber went on a long and difficult journey to learn Android and complete an app in under 9 weeks. Every week presented it's challenges, but in the end, we managed to overcome the hurdles and release our app and an update before the 9 weeks was up.",
            "From day 1, I was the person in our group who took charge. Throughout the project, I was in charge of keeping our group in contact, notifying members when and where we were meeting, and keeping us all on track. In leading the group, I learnt a few things after the first couple weeks, and I began to implement better practices. One of these practices was leading off each group meeting with an agenda: where are we now, what needs to get done by the end of the night, what bugs exist, and similar were generally the first questions I brought up. From there, we would each take a task and begin knocking things off of the list. Some nights we completed everything; other nights we didn't.",
            "For the first iteration of our project, we had to learn the game In Between. After playing the game a couple times, we all had a grasp of what needed to get done, and we began to draw up a list of objects, classes, and methods that we would probably need. Each week, every person was expected to get an object completed and the code pushed to the school's mercurial server. By the end of the first 2 weeks, we had everything created, and the last part was creating our game rules. For this first iteration, we focused on completing the backend: the game mechanics and objects. We made the game console playable, and although there were a few bugs, it worked fine.",
            "Iteration 2 began the most difficult part of the process: implementing the Android app. The first iteration was all Java based, no Android needed. For this iteration, we stated that we would have a basic UI completed. With no experience in how Android creates UIs, this was a massive challenge. Because there were other things left to do, I took on the task of creating our UI while I divied up some cleanup and bug fixing work for the others. As I made progress, I would let the other members know, and show them how to map a button or such so that the backend could begin working with the UI. At the end of iteration 2, the UI was very buggy but a user could successfully traverse through our 4 or so views. At this point, some of the in game view was working, but our game was unplayable due to many bug and glitches.",
            "Iteration 3 turned out to be 3 things: completion, cleanup, and updating. With all of the struggles of Iteration 2, we had finally grasped the workings of Android, and within the fist week, we were able to complete the app. The second week of this iteration consisted of small bug fixes and some code cleanup. At this point, the app was completed. It wasn't beautiful, but it worked exactly as expected, and it didn't crash. Again, I took charge and created a Google account specifically for our app, and I went through the process of putting our app on the Play Store. Within 2 days, the app was live. But we still had about a week left, and I was uncontent with the UI. So, in the last week of the project, I cleaned up the UI, and my other group members went on a massive code purge in which all code was cleaned and simplified. Hours before the projec deadline, we finished all of our updates and pushed the new version to the Play Store. As this update says on the Play Store, there is a polished UI with new card images, a new wait function to see each AI player's move, added tablet and language support, and lastly, the invisible code cleaning.",
            "Looking back at this project, this is one of the greatest learning experiences I've had. I'm proud of this app for the simple fact that it looks decent and it works. If I had to go back and change one thing, it wouldn't be anything to do with the app: it would be our development process. In starting with the backend, it made a massive mess whenever we transition to integrate it with the UI. This created bugs in the code that had once been fixed. Based on this, I learned that it is easier to start with the front-end (UI), and then do that back-end. Of course, Model-View separation kept in mind, this is in my opinion the best way to develop an application.",
            "Following this project, I created two other unpublished Android apps for other classes. For these, I started with a UI first design, and the app creation went so much smoother. The code is also public, so go check them out on the projects page!"
        ],
        images: [
             "/images/InBetween/icon.png",
             "/images/InBetween/Default/main.png",
             "/images/InBetween/Default/inGame.png",
             "/images/InBetween/Default/EN_settings.png",
             "/images/InBetween/Default/EN_help.png",
             "/images/InBetween/Default/10in_main.png",
             "/images/InBetween/Default/EN_10_settings.png",
             "/images/InBetween/Default/EN_10in_inGame.png",
             "/images/InBetween/Default/EN_10in_gameOver.png",
             "/images/InBetween/Default/EN_10in_help.png"
         ]
    }];

    var BuzzedBuddy = [{
        title: "Buzzed Buddy",
        status: "Completed",
        link: "http://devpost.com/software/buzzed-buddy",
        linkText: "View on ChallengePost",
        linkImage: "/images/SocialMedia/ChallengePost_icon.png",
        start: "Feb 27, 2015",
        end: "Mar 1, 2015",
        event: "HackIllinois 2015",
        description: [
                "Forming a group of 3 students from UIUC and myself, this application is the result of a collaborative effort at HackIllinois 2015. This app was a great learning experience for all of us as it gave them a chance to learn Swift, and myself a chance to improve upon my Swift knowledge.",
                "With no preconceived idea of what to do, this app idea was a spur of the moment thought. The concept behind this app was that every partying college student needs a friend that can help them A) find food, and B) get home. This in mind, we began to design our app with the notion that it must be simple, and that's what we did.",
                "After our idea was established, I took charge of our group and layed out exactly what would need to be done since I was the only person with any iOS experience. Because Storyboard's can be challenging to first learn, I took that portion of the project. Beyond that, I separated all of the back-end functions out to our members to complete. I had faith in all of them because Swift is a really easy language to pick up, and they are all very intelligent.",
                "After many hours of work, I completed the front-end just as the other group member were ready to begin linking to the UI. I have each of them a short tutorial and example on how to link up things to the UI, and with my help, everything got linked up and our app started to look like an actual functioning application.",
                "From this point, the development really consisted polishing up some of the features, fixing bugs, error catching, and refining the UI and backend to mesh together nicely. I spent a lot of time cleaning up the UI and making sure that every UI update was getting called correctly. During this, we came up with the idea that we should implement a 'Call your Ex' function, just as a joke. As it turned out, it was really easy to implement a button that makes a phone call, so within 2 hours, all of that was set up and working. We also decided to add a few other features, like scrollable text directions below the map view.",
                "As time was running out, our app suddenly began to face a problem of crashing a lot. Some of the issue had to do with the local bus system API that we used in our app. But othertimes, the app just didn't work well on some of our test devices. And so time ran out, and we were unable to solve the mysterious app crash. The crashes were seemingly sporatic, and they only happend on some of the devices, leaving us to this day unable to really pinpoint the cause.",
                "We've spoken of coming back to this app and releasing it, and so I believe this Summer we will revisit the app and finish it off. At this point in time, the app idly sits in a private GitHub repository. Upon completion, we may release the code.",
                "This crash course app development taught us all a lot about iOS and Swift development. After coming back and working on my other iOS apps, I frequently find myself looking a code snippets from the project because there were just so many good, clean implementations of saving settings, network calls, etc. This app was also a great experience for me to really nail iOS Auto-Layout, and creating Storyboards is now easier than ever."
            ],
        images: [
                "/images/HackIllinois_2015/buzzed-buddy_icon.png",
                "/images/HackIllinois_2015/buzzed-buddy_launch.png",
                "/images/HackIllinois_2015/buzzed-buddy_main1.png",
                "/images/HackIllinois_2015/buzzed-buddy_settings1.png",
                "/images/HackIllinois_2015/buzzed-buddy_settings2.png",
                "/images/HackIllinois_2015/buzzed-buddy_main2.png",
                "/images/HackIllinois_2015/buzzed-buddy_food.png",
                "/images/HackIllinois_2015/buzzed-buddy_foodChoice.png",
                "/images/HackIllinois_2015/buzzed-buddy_foodMap.png",
                "/images/HackIllinois_2015/buzzed-buddy_home.png",
                "/images/HackIllinois_2015/buzzed-buddy_info.png"
            ]
        }];

    var InBetween_iOS = [{
        title: "InBetween (iOS)",
        status: "In Development",
        link: "https://github.com/EPICmynamesBG/InBetween_iOS",
        linkText: "View on GitHub",
        linkImage: "/images/SocialMedia/github-1024-black.png",
        start: "Dec 2014",
        end: "Present",
        event: "n/a",
        description: [
                "Upon completion of InBetween for Android, I felt as though an iOS version should also be released. But with no experience developing for iOS, I was intimidated to begin. Finally, after weeks of debate, I followed an online video tutorial and created a simple app using Swift. From there, it all kept rolling.",
                "One of the most reassuring things about beginning this app was that fact that all of the back-end code already existed; all that I would have to do is interpret it into Swift. With my experience in the app devlopment process, I also knew that I needed to start with the UI. All of this in mind, I began my smy first struggle not with Storyborads and Auto-Layout, but with XCode and Git. It took me forever to get XCode to push to my repository, and things didn't really get easier from there.",
                "Designing the UI was super easy because I knew exactly what it needed to look like: the Android version. Designing the UI was also the hardest part because using Auto-Layout and figuring out how to dynamically resize objects to work on all screen sizes was a massive pain. The biggest thing I learnt here was to not be afraid to use many UIViews, either as button containers or even just empty ones to make sure things get properly spaced in all situations.",
                "Taking a short break from the UI, I began to translate some of the back-end code into Swift. I ran into a few issues along the way dealing with the use of 'static', but I was able to resolve all of those. At this point, all of the simple objects like a Card and Hand are completed. The game logic has yet to come, as does the Deck XML Parser.",
                "I also decided to add a 4th button to the main screen so that users can view their wins/losses. This itself has created some bugs with the main screen in landscape orientation, and I am currently working out those kinks.",
                "At this time, the biggest thing I've learned from this app is saving user settings from the settings pane. I thought this would be massively difficult, but it turned out to be super easy, and it's a great feeling of accomplishment knowing that it didn't take and arm and a leg to get those working.",
            ],
        images: [
                "/images/InBetween_iOS/icon.png",
                "/images/InBetween_iOS/main.png",
                "/images/InBetween_iOS/inGame.png",
                "/images/InBetween_iOS/paused.png",
                "/images/InBetween_iOS/help.png",
                "/images/InBetween_iOS/settings.png",
                "/images/InBetween_iOS/stats.png"
            ]
        }];
    /*
        var Audio_Sync = [{
            title: "Audio-Sync",
            status: "Cancelled",
            link: "",
            linkText: "Not publicly available",
            linkImage: "",
            start: "Feb 2014",
            end: "Present",
            event: "n/a",
            description: [
                    'After learning the basics of Swift, I thought of a new app idea. The thought behind this is app is this: "Have you ever wanted to play syncronized music playback between you and your friends device?" The answer for me at least is yes, and so I began my journey to create this cross-platform compatible app. While I am currently only developing for iOS, I intend to follow up with an Android version.',
                    "This app is currently in its early stages. Like many other projects, I am starting with the UI first. At this point, I am using a tab view controller to move between my three views: Connect, Host, and Settings. This is my first experience with tab views, but so far the experience has been positive. Further updates will be posted as this app begins to progress more."
                ],
            images: [
                    "/images/Audio-Sync/icon.png",
                    "/images/Audio-Sync/launch.png",
                    "/images/Audio-Sync/inApp.png"
                ]
            }];
    */
    var McVerilog = [{
        title: "McVerilog",
        status: "Incomplete, not in Development",
        link: "http://devpost.com/software/mcverilog",
        linkText: "View on ChallengePost",
        linkImage: "/images/SocialMedia/ChallengePost_icon.png",
        start: "Oct 17, 2014",
        end: "Oct 19, 2015",
        event: "BoilerMake 2014",
        description: [
            "Created at the Boilermake 2014 Hackathon, our group of 4 created a compiler that could convert Verilog low level machine code into Redstone circuits in Minecraft. The project uses a public project known as MCModify as part of the base. Being unfamiliar with this API, I spent most of my time at the hackathon struggling to comprehend it. Thankfully, my friend had spent some time studying it already and was able to help me along.",
                "The first thing we did at the hackathon was figure out how the code works and what changes in the MineCraft world whenever we upload our modified file. After hours of testing, we were able to figure out what needs to be done. At this point, we broke off into teams of 2: one team worked on the Verilog compiler, and the other worked on the logic gate and circuit creation logic for MineCraft.",
                "From here, I don't really know what went on in the Verilog compiler world, but in block generation world, we made a lot of awesome progress with immediately noticable results. I was given the task of creating functions that would generate a given logic gate; this meant placing certain blocks in a certain order from a given starting point. It took a lot of time to map all of those out, but I managed to finish it. Meanwhile, my friend was creating an algorithm for collision avoidance. That turned out to be really awesome, and that is why in the screenshots there are massive interwoven loops of blocks. All of this is generated without collision thanks to his algorithm.",
                "As the hackathon neared its' end, all of us were beaten down my lack of sleep and exhaustion. Disappointingly, we were unable to piece together the last part: connecting the Verilog compiler with the circuit generator. We were able to get the compiler to generate the basic logic gates, but the logic gates weren't connected, so it was completely useless. We were disappointed, but we showed our project off with pride knowing that we had visible progress and were so close to our goal.",
                "At the final demos, we got a lot of positive feedback on our project, and although we didn't win, we got the equivalent of an honarable mention when winners were being read off. At the end of this event, I felt like I hadn't contributed as much as my peers. I felt ashamed of what I offered to the group; but I held me head high because I had done something. I did contribute. And I was only a first semester sophmore; this was just one more reason to push myself to learn more about software development, and I have done since then to keep learning."
            ],
        images: [
                "/images/BoilerMake_2014/McVerilog1.png",
                "/images/BoilerMake_2014/McVerilog2.png",
                "/images/BoilerMake_2014/McVerilog3.png"
            ]
        }];

    var AugRealScavenger = [{
        title: "Augmented Reality Scavenger Hunt",
        status: "Incomplete, not in Development",
        link: "http://challengepost.com/software/augmented-reality-scavenger-hunt",
        linkText: "View on ChallengePost",
        linkImage: "/images/SocialMedia/ChallengePost_icon.png",
        start: "Apr 11, 2014",
        end: "Apr 13, 2014",
        event: "HackIllinois 2014",
        description: [
                "Created at HackIllinois 2014, this unfinished app was our groups first experience at both a hackathon and Android. While the app was and remains unfinished, this app served its' purpose in introducing us to Android app development. The app itself was supposed to be an Augmented Virtual Reality Scavenger Hunt in which there would be a map view show hunt location pins placed there by the event admin. For the VR part there was a compass arrow overlay placed on the live camera view. The function of this was to lead the person to the nearest pin without reopening the map view. Because there were only two views, we made use of a 2 tab view controller.",
                "The most difficult of this project was implementing the Google Maps API. At one point, we even had some Google members sitting with us, helping to implement the API. Eventually, we got it all figured out, and our app finally had some functionability.",
                "This hacakthon proved to be a great eye opener in multiple ways. First, we learned to come prepared. We didn't have a repository or anything set up before getting there, and with many issues holding us up, we ended up only being able to develop on one computer. Second, we learned that Android is NOT something to try and learn as a crash course in 36 hours. It's just not a good idea as it causes a lot of stress and confusion. Lastly, we learned that hackathons are really awesome, and we couldn't wait to go to the next one and hopefully come up with something a little better than this app."
            ],
        images: [
                "/images/HackIllinois_2014/hack_illinois_scavenger_2.png",
                "/images/HackIllinois_2014/hackIllinois2014_1.png",
                "/images/HackIllinois_2014/hackIllinois2014_2.png"
            ]
        }];

    var PlexServer = [{
        title: "Plex-Media Server",
        status: "Completed",
        link: "#",
        linkText: "",
        linkImage: "",
        start: "Jan 2015",
        end: "Jan 2015",
        event: "n/a",
        description: [
            "As a personal project, I built my own computer from scratch in order to use it as a Plex Media Server. In this computer build, my goal was to keep costs low while building a server fully capable of streaming 1080p HD to multiple devices with no issues. After assembling a parts list and aqcuiring all of the components, I built the system and set it up.",
            "For this build, I began with fist choosing my motherboard: an ASUS M5A78L-M LX PLUS. At around $40 after rebate, this micro-ATX motherboard was more than capable to meet my requirements and it was cost effective.",
            "Step two was choosing the CPU. Since the motherboard had an AM3+ CPU socket, I had to get an AMD processor. So I began to look for compatible CPUs that had multiple cores, yet it was cheap. And so I found the AMD FX-6300, a six core CPU that cost around $100 and would be fully capable of dishing out 1080p movies to more than one device.",
            "Since my core components were now chosen, I went through and found compatible RAM on Crucial.com. With Crucial compatibility guranteed, I found an 8GB Kit (4GBx2) for again around $100. Although 8GB was a little more than I should have needed, I didn't feel comfortable with only 4GB of RAM.",
            "Now came the 'after-thought' parts of my build. Because this build was only a media server, priority was not on appearance but on cost. This in mind, I searched Amazon until I found the cheapest possible solution: a two in one micro-ATX case and power supply. With about a $40 cost, this was by far the cheapest route I could have taken.",
            'Because slow USB transfer speeds bother me and this motherboard only supported USB 2.0, I made a cheap investment of $20 for a USB 3.0 PCIe add on card. Beyond this, I made no other costs on my build because I already had some parts, like a 750GB HDD from my Mac. I also had the 2.5" to 3.5" adapter on hand. With everything set, I made my purchases.',
            'Up until a month later when I purchased a 1TB 3.5" HDD on sale for $45, my build clocked in at around $330 ($375 after the new HDD). And after assembling all of the hardware, which took a few hours, I began setting up the software side.',
            "I'd planned for this for a while now, so on Virtual Machine's I'd practiced setting up a server. For my build, I went ahead and installed Ubuntu 14.04 x64 server: no problems there. I then proceded to install the basic GNOME interface because while I can use a terminal, I prefer to have a GUI. After my GUI was up and working, I installed TeamViewer so I could control the server without a keyboard and mouse attached. After TeamViewer came the most important part, the reason for the build: Plex. Installing Plex was a breeze; the most time consuming part was all of the settings and configuration, as well as the time to transfer all of my media to the server.",
            "Eventually I got everything set up and running, and since then I have been able to watch/listen to all my media over the local Ball State network. However, it didn't go quite as planned: of course I ran into a few issues while building this machine. On the hardware, everything went smooth until it came to hooking up the front panel; even with the motherboard guide, it took some trial and error to get all the pins set correctly. Then came the Plex file permissions error. Because of where I placed my media on my server, I had to manually change the file and folder permissions to public. This realization came after an hour of thinking Plex just couldn't find my files. And lastly, Plex itself had some issues; the most recent release version would have random issues where upon reboot, Plex would not be running. Because of this, I am running a version of Plex behind the current version until the bug is fixed.",
            "After all of these struggles, I can successfully say that I have built my own server, and I get great use out of it. In my opinion, this build was worth more in knowledge than it was money; I learnt so much about computer hardware and assembly, and I learnt more about Linux, the awesome free Operating System. If you're interested in my build, the parts list with links is posted below, so feel free to check it out and maybe even make your own!"
            ],
        images: [
                "/images/Plex-Server/Plex_server_0.jpg",
                "/images/Plex-Server/Plex_server_1.jpg",
                "/images/Plex-Server/Plex_server_2.jpg",
                "/images/Plex-Server/Plex_server_3.jpg",
                "/images/Plex-Server/Plex_server_4.jpg",
                "/images/Plex-Server/Plex_server_5.jpg",
                "/images/Plex-Server/Plex_server_6.png",
                "/images/Plex-Server/Plex_server_7.JPG",
                "/images/Plex-Server/Plex_server_8.JPG",
                "/images/Plex-Server/Plex_server_9.JPG",
                "/images/Plex-Server/Plex_server_10.JPG",
                "/images/Plex-Server/Plex_server_11.JPG",
                "/images/Plex-Server/Plex_server_12.png",
                "/images/Plex-Server/Plex_server_13.png",
                "/images/Plex-Server/Plex_server_14.png",
                "/images/Plex-Server/Plex_server_15.png",
                "/images/Plex-Server/Plex_server_16.png",
                "/images/Plex-Server/Plex_server_17.png",
                "/images/Plex-Server/Plex_server_18.png",
                "/images/Plex-Server/Plex_server_19.png",
                "/images/Plex-Server/Plex_server_20.png",
                "/images/Plex-Server/Plex_server_21.png",
                "/images/Plex-Server/Plex_server_22.png"
            ],
        parts: [
            {
                part: "ASUS M5A78L-M LX PLUS AM3+ AMD 760G Micro ATX AMD Motherboard",
                link: "http://www.amazon.com/M5A78L-M-LX-PLUS-Micro-Motherboard/dp/B005WUUFBW/ref=sr_1_1?s=electronics&ie=UTF8&qid=1426882372&sr=1-1&keywords=ASUS+M5A78L-M+LX+PLUS+AM3%2B+AMD+760G+Micro+ATX+AMD+Motherboard"
                },
            {
                part: "AMD FD6300WMHKBOX FX-6300 6-Core Processor Black Edition",
                link: "http://www.amazon.com/AMD-FD6300WMHKBOX-FX-6300-6-Core-Processor/dp/B009O7YORK/ref=sr_1_1?s=electronics&ie=UTF8&qid=1426882351&sr=1-1&keywords=AMD+FD6300WMHKBOX+FX-6300+6-Core+Processor+Black+Edition"
                },
            {
                part: "Crucial RAM 8GB Kit (4GBx2)",
                link: "http://www.crucial.com/ProductDisplay?modelCatId=18885&storeId=10151&productId=11432&urlRequestType=Base&langId=-1&externalPartNumber=CT2684790&catalogId=10001"
                },
            {
                part: "Rosewill Dual Fans MicroATX Mini Tower Computer Case FBM-01",
                link: "http://www.amazon.com/Rosewill-MicroATX-Tower-Computer-FBM-01/dp/B005LIDU5S/ref=sr_1_1?s=electronics&ie=UTF8&qid=1426882380&sr=1-1&keywords=Rosewill+Dual+Fans+MicroATX+Mini+Tower+Computer+Case+FBM-01"
                },
            {
                part: "Anker Uspeed USB 3.0 PCI-E Express Card",
                link: "http://www.amazon.com/Anker%C2%AE-Express-Connector-Desktops-Chipset/dp/B005ARQV6U/ref=sr_1_1?s=electronics&ie=UTF8&qid=1426882328&sr=1-1&keywords=Anker%C2%AE+Uspeed+USB+3.0+PCI-E+Express+Card+with+4+USB+3.0+Ports+and+5V+4-Pin+Power+Connector+for+Desktops+[VL805+Chipset]"
                },
            {
                part: "WD Blue 1TB SATA 6Gb/s 7200rpm Internal Hard Drive",
                link: "http://www.amazon.com/Blue-SATA-7200rpm-Internal-Drive/dp/B0088PUEPK/ref=sr_1_1?s=electronics&ie=UTF8&qid=1426882386&sr=1-1&keywords=WD+Blue+1TB+SATA+6Gb%2Fs+7200rpm+Internal+Hard+Drive"
                },
            {
                part: "Ubuntu 14.04 Server OS",
                link: "http://www.ubuntu.com/desktop"
                }
            ]
        }];

    var CodeOfKnighthood = [{
        title: "Code of Knighthood",
        status: "Completed, Unpublished",
        link: "https://github.com/EPICmynamesBG/Code-Of-Knighthood",
        linkText: "View on GitHub",
        linkImage: "/images/SocialMedia/github-1024-black.png",
        start: "Dec 2014",
        end: "Dec 2014",
        event: "n/a",
        description: [
                "As a final project for an Honors class, I decided to make an Android app. In this app, with the help of a classmate, we are simply analyzing and explaining the Code of Knighthood in a Medieval and Modern context.",
                "This app was put together rather quickly, in under a weeks time. I attributte this speedy development to the fact that I was just finishing up InBetween for Android, and was more than confident in my abilities to create a simple app that only needed to display some text and images.",
                "Starting with the UI, I decided that there would be 3 or 4 views, and that I wanted to be able to swipe left and right to go to the next/previous view. After research, this meant implementing a Fragment Activity and Manager. I figured this would be difficult, but it didn't turn out to be too bad.",
                "Once I had figured this out, all I had to do was set up the text file parsing. For this app, I wanted it to be so that all of the text would be filled in from a text file because it was my partner's job to acquire most of the content. By doing this, all I needed to do was past the given content into the text files, and the text appeared as was in the app.",
                "This app was a nice and simple follow up to InBetween, and while I didn't learn near as much from it, I did learn that it is possible to speedily create mobile applications whenever you aren't trying to learn everything."
            ],
        images: [
                "/images/CodeOfKnighthood/icon.png",
            "/images/CodeOfKnighthood/CoK_main.png",
            "/images/CodeOfKnighthood/CoK_inApp.png"
            ]
        }];

    var PlantsInSpace = [{
        title: "Plants in Space",
        status: "Completed, Unpublished",
        link: "https://github.com/EPICmynamesBG/Plants-In-Space",
        linkText: "View on GitHub",
        linkImage: "/images/SocialMedia/github-1024-black.png",
        start: "Nov 2014",
        end: "Nov 2014",
        event: "n/a",
        description: [
                "This app was created for a course on Game Design. In this class, we met up with the Indianapolis Children's Museum and discussed the different displays that would be coming up. One of the displays mentioned was an exhibit on the International Space station; thus, the inspiration for this app came from that. After researching some ISS experiments, I came up with this concept of a simple interactive that would guide children through an experiment. This Android app was a simple way to show how that interactive might look.",
                "The concept behind this interactive is that plants grow differently with different levels of light and gravity. Using this simple app, users can see that a plant growing on earth without sunlight will hardly grow, while a plant grown in space with no sunlight will still grow a little, but it grows in every direction. Similarly, growing both with sunlight, the one in space grows taller because there is less vertical resistance. This experiment proves that plant growth direction and height is determined both by light and gravity. ",
                "Being as this app was only a mock up of an interactive, there really wasn't much to this app besides the UI. I spent a good deal of time getting the UI set up properly, but besides that, there are just a few boolean variables in the back-end that determine which plant will be shown at the end of the experiment.",
                "I creating this app, there was no real learning curve or experience; it simply demonstrated how far I had come since developing InBetween, and how much I had learned over that process. At the beginning of the semester, I would have never imagined throwing together an app in 3 hours.",
                "This app isn't going to be released to the Play Store, but the code is openly available on GitHub for anybody who wants to test it out."
            ],
        images: [
                "/images/PlantsInSpace/icon.png",
                "/images/PlantsInSpace/PiS_main.png",
                "/images/PlantsInSpace/PiS_Q1.png",
                "/images/PlantsInSpace/PiS_Q2.png",
                "/images/PlantsInSpace/PiS_result.png"
            ]
        }];

    var Bombnanza = [{
        title: "Bombnanza",
        status: "Completed, Unpublished",
        link: "https://github.com/EPICmynamesBG/Bombnanza",
        linkText: "View on GitHub",
        linkImage: "/images/SocialMedia/github-1024-black.png",
        start: "Apr 2015",
        end: "Apr 2015",
        event: "n/a",
        description: [
                "This app was created for a course final creative project. This is my first fully completed iOS app, and it is written in Objective-C. For testing, I had access to 2 iPod 4th Gens and 1 iPad 4. This application does work on all of them, so I am confident it would work on any iOS 6+ device. The purpose of this application was to deomnstrate the after effects of the Cold War on modern America and even the world. This app features three parts: a Testing Range, a Knowledgebase, and the Cold War After Effects.",
            "During development, I spent the most time creating the testing range. The testing range features a dropping bomb that when it sinks below the bottom of the screen, it explodes at a scale equal to the bomb's yield. There is also an explosion sound effect done at the same time. All of this animation took a while to figure out as I had previously learnt how to do it on iOS 7+, but not 6. After this was all set up, I looked online for a potential project that featured overlays on a modern map. The Carlos Labs project was exactly what I was looking for, and they even had their source code available. With a few modifications to the html, css, and js, I was able to get the map view looking sharp on both the iPod and iPad screens. In my opinion, this is the coolest feature because users can use the Google Map view to locate their town, then see what a bomb like Fat Man would do to it.",
            "The next view I worked on was the knowledgebase. From some work projects, I was familiar with using table views and json data for populating them, so that's what I chose to do. After all the research was done, it was pretty simple to just set up the table view and the subsequent bomb information view that features stats like the yield, what nation developed it, when it was developed, and even information on how the live tests went. Overall, this section was fairly easy, and the research was the most time consuming part.",
            "The last view was the actual information on the Cold War's after effects. To mix things up, I treid to use a page view controller. After finding an example online, this proved to be fairly simple. Again, I used a json file to populate each page view, and it worked like a charm. Overall, this section took the least amount of time because it was nearly all text.",
            "From the beginning, I knew I wouldn't release this app. While it is complete, the app has its problems, the biggest being that some of the images used are presumably copyright protected. That didn't matter since I was using them for educational purposes, but to release them in as part of my own app is another thing. Also, while I did my best to make all of the research accurate, I cannot gurantee that everything is correct. All of this aside though, I was proud of how this app turned out, and I am thrilled to be able to say that I have completed my own iOS app."
            ],
        images: [
                "/images/Bombnanza/Bombnanza0.png",
                "/images/Bombnanza/Bombnanza1.png",
                "/images/Bombnanza/Bombnanza2.png",
                "/images/Bombnanza/Bombnanza3.png",
                "/images/Bombnanza/Bombnanza4.png",
                "/images/Bombnanza/Bombnanza5.png",
                "/images/Bombnanza/Bombnanza6.png",
                "/images/Bombnanza/Bombnanza7.png",
                "/images/Bombnanza/Bombnanza8.png",
                "/images/Bombnanza/Bombnanza9.png",
                "/images/Bombnanza/Bombnanza10.png",
                "/images/Bombnanza/Bombnanza11.png",
                "/images/Bombnanza/Bombnanza12.png",
                "/images/Bombnanza/Bombnanza13.png",
                "/images/Bombnanza/Bombnanza14.png",
                "/images/Bombnanza/Bombnanza15.png"
            ]
        }];

    var HackOLantern = [{
        title: "Hack-o-lantern",
        status: "Completed",
        link: "http://devpost.com/software/trick-or-tweet",
        linkText: "View on Devpost",
        linkImage: "",
        start: "Oct 16, 2015",
        end: "Oct 18, 2015",
        event: "BoilerMake 2015",
        description: ["Created during the BoilerMake 2015 hackathon, our group wanted to do something in the spirit of Halloween. Inspired by some ideas we saw online, we decided we wanted to use capacitive touch to make our pumpkin do something. With a Pumpkin, a Raspberry Pi, and a camera module, we set out to make the first Jack-o-lantern that would live tweet a selfie on touch. With a little Python and some hardware, we accomplished the most creative and amusing photo booth the world may have ever seen. Check out the full details and promo video at the link provided!"],
        images: [
                "/images/BoilerMake_2015/PumpkinPromo.jpg"
            ]
        }];
    //-------------ACTIVE CODE------------------------

    var project = [];
    console.log($route.current.params.title);
    switch ($route.current.params.title) {
    case "InBetween":
        project = InBetween;
        break;
    case "Buzzed Buddy":
        project = BuzzedBuddy;
        break;
    case "InBetween (iOS)":
        project = InBetween_iOS;
        break;
        /*case "Audio-Sync":
            project = Audio_Sync;
            break;*/
    case "McVerilog":
        project = McVerilog;
        break;
    case "Augmented Reality Scavenger Hunt":
        project = AugRealScavenger;
        break;
    case "Plex-Media Server":
        project = PlexServer;
        break;
    case "Code of Knighthood":
        project = CodeOfKnighthood;
        break;
    case "Plants in Space":
        project = PlantsInSpace;
        break;
    case "Bombnanza":
        project = Bombnanza;
        break;
    case "Hack-o-lantern":
        project = HackOLantern;
        break;
    default:
        project = blank;
        break;
    }

    $scope.project = project;

};