function ProjectsController($http, $scope, $route, $location) {
    
    $scope.singleProjectClick = function(title) {
            $location.path("/projects/"+title);
        };
    
    $scope.projects = [{ 
        title: "InBetween",
        status: "Published on Google Play Store",
        link: "https://play.google.com/store/apps/details?id=com.BSU.inbetween",
        start: "Sept 2014",
        end: "Present",
        showEvent: false,
        event: "",
        description: "In Between is a simple card game that is relatively unfound on app stores. For our group's final project in CS222 (Advanced Programming), we are creating an Android app of this game. Under my direction, we consistently met and achieved goals that brought us closer to having a final product. On 11/22/2014, version 1 of the app was released worldwide on the Google Play store. The current version is 1.1.1.",
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
        },{
            title: "Buzzed Buddy",
            status: "In Development",
            link: "http://challengepost.com/software/buzzed-buddy",
            start: "Feb 27, 2015",
            end: "Mar 1, 2015",
            showEvent: true,
            event: "HackIllinois 2015",
            description: "Created during HackIllinois 2015, the idea behind this app was to create something simple that would be useful for college students. The app features an extremely simple interface that aids in two things: finding nearby food, and going home. There is also a hidden feature that can be enabled in the settings. For this mobile application, we developed for iOS using the new Swift language. Buzzed Buddy makes use of the built in Apple Maps as well as the UIUC local bus system's API.",
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
        }, {
            title: "InBetween (iOS)",
            status: "In Development",
            link: "#",
            start: "Dec 2014",
            end: "Present",
            showEvent: false,
            event: "",
            description: "Upon completion of InBetween for Android, I felt as though an iOS version should also be released. Thus, I began to study Swift for iOS and have since started creating the remake of InBetween for iOS. The process has been fairly difficult at times, but I am content with the progress I have made so far.",
            images: [
                "/images/InBetween_iOS/icon.png",
                "/images/InBetween_iOS/main.png",
                "/images/InBetween_iOS/inGame.png",
                "/images/InBetween_iOS/paused.png",
                "/images/InBetween_iOS/help.png",
                "/images/InBetween_iOS/settings.png",
                "/images/InBetween_iOS/stats.png"
            ]
        }, {
            title: "Audio-Sync",
            status: "In Development",
            link: "#",
            start: "Feb 2014",
            end: "Present",
            showEvent: false,
            event: "",
            description: 'After learning the basics of Swift, I thought of a new app idea. The thought behind this is app is this: "Have you ever wanted to play syncronized music playback between you and your friends device?" The answer for me at least is yes, and so I began my journey to create this cross-platform compatible app. While I am currently only developing for iOS, I intend to follow up with an Android version.',
            images: [
                "/images/Audio-Sync/icon.png",
                "/images/Audio-Sync/launch.png",
                "/images/Audio-Sync/inApp.png"
            ]
        }, {
            title: "McVerilog",
            status: "Incomplete",
            link: "http://challengepost.com/software/mcverilog",
            start: "Oct 17, 2014",
            end: "Oct 19, 2015",
            showEvent: true,
            event: "BoilerMake 2014",
            description: "Created at the Boilermake 2014 Hackathon, our group of 4 created a compiler that could convert Verilog low level machine code into Redstone circuits in Minecraft. The project uses a public project known as MCModify as part of the base. The project is 80% complete at this time and may be revisited in the future to complete and clean. The code is at this time located in a private repository.",
            images: [
                "/images/BoilerMake_2014/McVerilog1.png",
                "/images/BoilerMake_2014/McVerilog2.png",
                "/images/BoilerMake_2014/McVerilog3.png"
            ]
        }, {
            title: "Augmented Reality Scavenger Hunt",
            status: "Incomplete",
            link: "http://challengepost.com/software/augmented-reality-scavenger-hunt",
            start: "Apr 11, 2014",
            end: "Apr 13, 2014",
            showEvent: true,
            event: "HackIllinois 2014",
            description: "Created at HackIllinois 2014, this unfinished app was our groups first experience at both a hackathon and Android. While the app was and remains unfinished, this app served its' purpose in introducing us to Android app development. the app itself was supposed to be an Augmented Virtual Reality Scavenger Hunt in which there would be a map view show hunt location pins, and the VR part where a virtual compass was overlaid on the screen. The user would have to take a picture at the location to capture that point.",
            images: [
                "/images/HackIllinois_2014/hack_illinois_scavenger_2.png",
                "/images/HackIllinois_2014/hackIllinois2014_1.png",
                "/images/HackIllinois_2014/hackIllinois2014_2.png"
            ]
        }, {
            title: "Plex-Media Server",
            status: "Completed",
            link: "#",
            start: "Jan 2015",
            end: "Jan 2015",
            showEvent: false,
            event: "",
            description: "As a personal project, I built my own computer from scratch in order to use it as a Plex Media Server. In this computer build, my goal was to keep costs low while building a server fully capable of streaming 1080p HD to multiple devices with no issues. After assembling a parts list and aqcuiring all of the components, I built the system and set it up. To learn more details about this project, please click on the project banner above.",
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
            ]
        }, {
            title: "Code of Knighthood",
            status: "Completed",
            link: "#",
            start: "Dec 2014",
            end: "Dec 2014",
            showEvent: false,
            event: "",
            description: "As a final project for an honors class, I have decided to make an Android app. In this app, with the help of a classmate, we are simply analyzing and explaining the Code of Knighthood in a Medieval and Modern context. I also experimented with Android Fragment Activities in this app.",
            images: [
                "/images/CodeOfKnighthood/icon.png",
            "/images/CodeOfKnighthood/CoK_main.png",
            "/images/CodeOfKnighthood/CoK_inApp.png"
            ]
        }, {
            title: "Plants in Space",
            status: "Completed",
            link: "#",
            start: "Nov 2014",
            end: "Nov 2014",
            showEvent: false,
            event: "",
            description: "This app was created for a course on Game Design. In this class, we met up with the Indianapolis Children's Museum and discussed the different displays that would be coming up. One of the displays mentioned was an exhibit on the International Space station; thus, the inspiration for this app came from that. After researching some ISS experiments, I came up with this concept of a simple interactive that would guide children through an experiment. This Android app was a simple way to show how that interactive might look.",
            images: [
                "/images/PlantsInSpace/icon.png",
                "/images/PlantsInSpace/PiS_main.png",
                "/images/PlantsInSpace/PiS_Q1.png",
                "/images/PlantsInSpace/PiS_Q2.png",
                "/images/PlantsInSpace/PiS_result.png"
            ]
        }];       
}