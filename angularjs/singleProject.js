function SingleProjectController($http,$scope, $route, $location){
    
    
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
            "In Between is a simple card game that is relatively unfound on app stores. For our group's final project in CS222 (Advanced Programming), we are creating an Android app of this game. Under my direction, we consistently met and achieved goals that brought us closer to having a final product. On 11/22/2014, version 1 of the app was released worldwide on the Google Play store. The current version is 1.1.1."
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
            status: "In Development",
            link: "http://challengepost.com/software/buzzed-buddy",
            linkText: "View on ChallengePost",
            linkImage: "",
            start: "Feb 27, 2015",
            end: "Mar 1, 2015",
            event: "HackIllinois 2015",
            description: [
            "Created during HackIllinois 2015, the idea behind this app was to create something simple that would be useful for college students. The app features an extremely simple interface that aids in two things: finding nearby food, and going home. There is also a hidden feature that can be enabled in the settings. For this mobile application, we developed for iOS using the new Swift language. Buzzed Buddy makes use of the built in Apple Maps as well as the UIUC local bus system's API."
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
            link: "#",
            linkText: "",
            linkImage: "",
            start: "Dec 2014",
            end: "Present",
            event: "n/a",
            description: [
            "Upon completion of InBetween for Android, I felt as though an iOS version should also be released. Thus, I began to study Swift for iOS and have since started creating the remake of InBetween for iOS. The process has been fairly difficult at times, but I am content with the progress I have made so far."
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
    
    var Audio_Sync = [{
            title: "Audio-Sync",
            status: "In Development",
            link: "#",
            linkText: "",
            linkImage: "",
            start: "Feb 2014",
            end: "Present",
            event: "n/a",
            description: [
            'After learning the basics of Swift, I thought of a new app idea. The thought behind this is app is this: "Have you ever wanted to play syncronized music playback between you and your friends device?" The answer for me at least is yes, and so I began my journey to create this cross-platform compatible app. While I am currently only developing for iOS, I intend to follow up with an Android version.'
            ],
            images: [
                "/images/Audio-Sync/icon.png",
                "/images/Audio-Sync/launch.png",
                "/images/Audio-Sync/inApp.png"
            ]
        }];
    
    var McVerilog = [{
            title: "McVerilog",
            status: "Incomplete",
            link: "http://challengepost.com/software/mcverilog",
            linkText: "View on ChallengePost",
            linkImage: "",
            start: "Oct 17, 2014",
            end: "Oct 19, 2015",
            event: "BoilerMake 2014",
            description: [
            "Created at the Boilermake 2014 Hackathon, our group of 4 created a compiler that could convert Verilog low level machine code into Redstone circuits in Minecraft. The project uses a public project known as MCModify as part of the base. The project is 80% complete at this time and may be revisited in the future to complete and clean. The code is at this time located in a private repository."
            ],
            images: [
                "/images/BoilerMake_2014/McVerilog1.png",
                "/images/BoilerMake_2014/McVerilog2.png",
                "/images/BoilerMake_2014/McVerilog3.png"
            ]
        }];
    
    var AugRealScavenger = [{
            title: "Augmented Reality Scavenger Hunt",
            status: "Incomplete",
            link: "http://challengepost.com/software/augmented-reality-scavenger-hunt",
            linkText: "View on ChallengePost",
            linkImage: "",
            start: "Apr 11, 2014",
            end: "Apr 13, 2014",
            event: "HackIllinois 2014",
            description: [
            "Created at HackIllinois 2014, this unfinished app was our groups first experience at both a hackathon and Android. While the app was and remains unfinished, this app served its' purpose in introducing us to Android app development. the app itself was supposed to be an Augmented Virtual Reality Scavenger Hunt in which there would be a map view show hunt location pins, and the VR part where a virtual compass was overlaid on the screen. The user would have to take a picture at the location to capture that point."
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
            'Because I slow USB transfer speed bothers me and this motherboard only supported USB 2.0, I made a cheap investment of $20 for a USB 3.0 PCIe add on card. Beyond this, I made no other costs on my build because I already had some parts, like a 750GB HDD from my Mac. I also had the 2.5" to 3.5" adapter on hand. With everything set, I made my purchases.',
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
            status: "Completed",
            link: "#",
            linkText: "",
            linkImage: "",
            start: "Dec 2014",
            end: "Dec 2014",
            event: "n/a",
            description: [
            "As a final project for an honors class, I have decided to make an Android app. In this app, with the help of a classmate, we are simply analyzing and explaining the Code of Knighthood in a Medieval and Modern context. I also experimented with Android Fragment Activities in this app."
            ],
            images: [
                "/images/CodeOfKnighthood/icon.png",
            "/images/CodeOfKnighthood/CoK_main.png",
            "/images/CodeOfKnighthood/CoK_inApp.png"
            ]
        }];
    
    var PlantsInSpace = [{
            title: "Plants in Space",
            status: "Completed",
            link: "#",
            linkText: "",
            linkImage: "",
            start: "Nov 2014",
            end: "Nov 2014",
            event: "n/a",
            description: [
            "This app was created for a course on Game Design. In this class, we met up with the Indianapolis Children's Museum and discussed the different displays that would be coming up. One of the displays mentioned was an exhibit on the International Space station; thus, the inspiration for this app came from that. After researching some ISS experiments, I came up with this concept of a simple interactive that would guide children through an experiment. This Android app was a simple way to show how that interactive might look."
            ],
            images: [
                "/images/PlantsInSpace/icon.png",
                "/images/PlantsInSpace/PiS_main.png",
                "/images/PlantsInSpace/PiS_Q1.png",
                "/images/PlantsInSpace/PiS_Q2.png",
                "/images/PlantsInSpace/PiS_result.png"
            ]
        }];
    
    //-------------ACTIVE CODE------------------------
    
    var project = [];
    console.log($route.current.params.title);
    switch($route.current.params.title) {
            case "InBetween":
                project = InBetween;
                break;
            case "Buzzed Buddy":
                project = BuzzedBuddy; 
                break;
            case "InBetween (iOS)":
                project = InBetween_iOS; 
                break;
            case "Audio-Sync":
                project = Audio_Sync;
                break;
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
            default:
                project = blank;
                break;
    }
    
    $scope.project = project;

};