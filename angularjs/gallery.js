function GalleryController($http, $scope, $route, $location) {

    $scope.photoGallery = [{
            image: "/images/InBetween/icon.png",
            description: "InBetween app icon"
    }, {
            image: "/images/InBetween/Default/main.png",
            description: "InBetween main menu"
    }, {
            image: "/images/InBetween/Default/10in_main.png",
            description: "InBetween tablet main menu"
    }, {
            image: "/images/InBetween/Default/inGame.png",
            description: "InBetween in game"
    }, {
            image: "/images/InBetween/Default/EN_10in_inGame.png",
            description: "InBetween tablet in game"
    }, {
            image: "/images/InBetween/Default/EN_10in_gameOver.png",
            description: "InBetween tablet game over"
    }, {
            image: "/images/InBetween/Default/EN_settings.png",
            description: "InBetween settings"
    }, {
            image: "/images/InBetween/Default/EN_10_settings.png",
            description: "InBetween tablet settings"
    }, {
            image: "/images/InBetween/Default/EN_10in_help.png",
            description: "InBetween tablet help"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_icon.png",
            description: "Buzzed Buddy icon"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_launch.png",
            description: "Buzzed Buddy launch screen"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_main1.png",
            description: "Buzzed Buddy main menu"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_settings1.png",
            description: "Buzzed Buddy settings"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_settings2.png",
            description: "Buzzed Buddy settings"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_main2.png",
            description: "Buzzed Buddy alternate main menu"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_food.png",
            description: "Buzzed Buddy food menu"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_foodChoice.png",
            description: "Buzzed Buddy food choices"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_foodMap.png",
            description: "Buzzed Buddy food map"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_home.png",
            description: "Buzzed Buddy home map"
    }, {
            image: "/images/HackIllinois_2015/buzzed-buddy_info.png",
            description: "Buzzed Buddy info"
    }, {
            image: "/images/BoilerMake_2014/McVerilog1.png",
            description: "McVerilog"
    }, {
            image: "/images/BoilerMake_2014/McVerilog2.png",
            description: "McVerilog"
    }, {
            image: "/images/BoilerMake_2014/McVerilog3.png",
            description: "McVerilog"
    }, {
            image: "/images/HackIllinois_2014/hack_illinois_scavenger_2.png",
            description: "Augmented Virtal Reality Scavenger icon"
    }, {
            image: "/images/HackIllinois_2014/hackIllinois2014_1.png",
            description: "Augmented Virtal Reality Scavenger map"
    }, {
            image: "/images/HackIllinois_2014/hackIllinois2014_2.png",
            description: "Augmented Virtal Reality Scavenger live view"
    }, {
            image: "/images/PlantsInSpace/icon.png",
            description: "Plants in Space icon"
    }, {
            image: "/images/PlantsInSpace/PiS_main.png",
            description: "Plants in Space main menu"
    }, {
            image: "/images/PlantsInSpace/PiS_Q1.png",
            description: "Plants in Space question 1"
    }, {
            image: "/images/PlantsInSpace/PiS_Q2.png",
            description: "Plants in Space question 2"
    }, {
            image: "/images/PlantsInSpace/PiS_result.png",
            description: "Plants in Space result"
    }, {
            image: "/images/InBetween_iOS/icon.png",
            description: "InBetween for iOS icon"
    }, {
            image: "/images/InBetween_iOS/main.png",
            description: "InBetween for iOS main menu"
    }, {
            image: "/images/InBetween_iOS/paused.png",
            description: "InBetween for iOS paused"
    }, {
            image: "/images/InBetween_iOS/help.png",
            description: "InBetween for iOS help"
    }, {
            image: "/images/InBetween_iOS/settings.png",
            description: "InBetween for iOS settings"
    }, {
            image: "/images/InBetween_iOS/stats.png",
            description: "InBetween for iOS stats"
    },
        /*{
               image: "/images/Audio-Sync/icon.png",
               description: "Audio-Sync icon"
           }, {
               image: "/images/Audio-Sync/launch.png",
               description: "Audio-Sync launchscreen"
           }, {
               image: "/images/Audio-Sync/inApp.png",
               description: "Audio-Sync in app"
           },*/
        {
            image: "/images/Plex-Server/Plex_server_0.jpg",
            description: "Plex Server CPU: AMD FX-6300"
    }, {
            image: "/images/Plex-Server/Plex_server_1.jpg",
            description: "Plex Server Motherboard: ASUS M5A78L-M LX PLUS"
    }, {
            image: "/images/Plex-Server/Plex_server_2.jpg",
            description: "Plex Server PCIe Add-on: Anker USB 3.0"
    }, {
            image: "/images/Plex-Server/Plex_server_3.jpg",
            description: "Plex Server Case: Rosewill FBM-01"
    }, {
            image: "/images/Plex-Server/Plex_server_5.jpg",
            description: "Plex Server Case: Rosewill FBM-01"
    }, {
            image: "/images/Plex-Server/Plex_server_4.jpg",
            description: "Plex Server HDD: WD Blue 1TB"
    }, {
            image: "/images/Plex-Server/Plex_server_6.png",
            description: "Plex Server RAM: Crucial 8GB"
    }, {
            image: "/images/Plex-Server/Plex_server_7.JPG",
            description: "Personally Assembled Plex Server"
    }, {
            image: "/images/Plex-Server/Plex_server_8.JPG",
            description: "Personally Assembled Plex Server"
    }, {
            image: "/images/Plex-Server/Plex_server_9.JPG",
            description: "Personally Assembled Plex Server"
    }, {
            image: "/images/Plex-Server/Plex_server_10.JPG",
            description: "Personally Assembled Plex Server"
    }, {
            image: "/images/Plex-Server/Plex_server_11.JPG",
            description: "Personally Assembled Plex Server"
    }, {
            image: "/images/Plex-Server/Plex_server_12.png",
            description: "Plex Server web management interface"
    }, {
            image: "/images/Plex-Server/Plex_server_13.png",
            description: "Plex Server live activity: 4 devices at 1080p"
    }, {
            image: "/images/Plex-Server/Plex_server_14.png",
            description: "Plex Server: System stats while streaming"
    }, {
            image: "/images/Plex-Server/Plex_server_15.png",
            description: "Plex Server: System activity while streaming"
    }, {
            image: "/images/Plex-Server/Plex_server_16.png",
            description: "Plex Server CPU Stats"
    }, {
            image: "/images/Plex-Server/Plex_server_17.png",
            description: "Plex Server Graphics Stats"
    }, {
            image: "/images/Plex-Server/Plex_server_18.png",
            description: "Plex Server Motherboard Stats"
    }, {
            image: "/images/Plex-Server/Plex_server_19.png",
            description: "Plex Server Boot Drive"
    }, {
            image: "/images/Plex-Server/Plex_server_20.png",
            description: "Plex Server 2nd Drive with Plex Media"
    }, {
            image: "/images/Plex-Server/Plex_server_21.png",
            description: "Plex Server OS Info"
    }, {
            image: "/images/Plex-Server/Plex_server_22.png",
            description: "Plex Server RAM Stats"
    }, {
            image: "/images/Bombnanza/Bombnanza0.png",
            description: "Bombnanza Main Screen"
    }, {
            image: "/images/Bombnanza/Bombnanza1.png",
            description: "Testing Range - Choice View"
    }, {
            image: "/images/Bombnanza/Bombnanza2.png",
            description: "Testing Range - Falling Bomb"
    }, {
            image: "/images/Bombnanza/Bombnanza3.png",
            description: "Testing Range - Falling Bomb"
    }, {
            image: "/images/Bombnanza/Bombnanza4.png",
            description: "Testing Range - Explosion Start"
    }, {
            image: "/images/Bombnanza/Bombnanza5.png",
            description: "Testing Range - Explosion"
    }, {
            image: "/images/Bombnanza/Bombnanza6.png",
            description: "Testing Range - Explosion Peak"
    }, {
            image: "/images/Bombnanza/Bombnanza7.png",
            description: "Testing Range - Live Map Pressure Overlay"
    }, {
            image: "/images/Bombnanza/Bombnanza8.png",
            description: "Testing Range - Live Map Thermal Overlay"
    }, {
            image: "/images/Bombnanza/Bombnanza9.png",
            description: "Bomb Knowledgebase - Bomb Choice"
    }, {
            image: "/images/Bombnanza/Bombnanza10.png",
            description: "Bomb Info View"
    }, {
            image: "/images/Bombnanza/Bombnanza11.png",
            description: "Bomb Info View"
    }, {
            image: "/images/Bombnanza/Bombnanza12.png",
            description: "Cold War After Effects - Military"
    }, {
            image: "/images/Bombnanza/Bombnanza13.png",
            description: "Cold War After Effects - Society"
    }, {
            image: "/images/Bombnanza/Bombnanza14.png",
            description: "Cold War After Effects - Technology"
    }, {
            image: "/images/Bombnanza/Bombnanza15.png",
            description: "Cold War After Effects - Space Exploration"
    }, {
            image: "/images/BoilerMake_2015/PumpkinPromo.jpg",
            description: "Hack-o-lantern Tweeting Pumpkin"
    }];

    $scope.leftHovering = false;
    $scope.rightHovering = false;
    var currentIndex = 0;

    $scope.loadImage = function (index) {
        currentIndex = index;
        $scope.selectedImageURL = $scope.photoGallery[currentIndex].image;
        $scope.showPopup = true;
    }

    $scope.closePopup = function () {
        $scope.showPopup = false;
    }

    $scope.next = function () {
        currentIndex += 1;
        if (currentIndex > $scope.photoGallery.length - 1) {
            currentIndex = 0;
        }
        $scope.selectedImageURL = $scope.photoGallery[currentIndex].image;
    }

    $scope.previous = function () {
        currentIndex -= 1;
        if (currentIndex < 0) {
            currentIndex = $scope.photoGallery.length - 1;
        }
        $scope.selectedImageURL = $scope.photoGallery[currentIndex].image;
    }
};