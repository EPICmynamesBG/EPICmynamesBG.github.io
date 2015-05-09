function InformationController($http, $scope, $route, $location) {
    $scope.personalityTraits = [
        "Leadership",
        "Motivated",
        "Critical Thinker",
        "Reliable"
    ]

    $scope.skills = [
        "Operating Systems",
        "Windows",
        "Computer Proficient",
        "Android development",
        "iOS Objective-C",
        "Java",
        "HTML",
        "CSS",
        "jQuery",
        "Information Technology",
        "Computer Hardware",
        "OS X",
        "Linux",
        "iOS Development",
        "iOS Swift",
        "Python",
        "PHP",
        "JavaScript",
        "Angular.js",
        "Troubleshooting",
        "Computer Repair"
        ]

    $scope.interests = [
        "Computers",
        "Programming",
        "Virtual Machines",
        "Music & Music Production",
        "Computer Hardware",
        "Operating Systems",
        "Mobile App Development",
        "Singing & Performing"
    ];

    $scope.jobs = [{
        title: "Information Technology Intern",
        company: "Midmark",
        location: "Versailles, OH",
        start: "May 2015",
        end: "Present",
        contact: "Nicole Robbins",
        contactEmail: "nrobbins@midmark.com",
        description: "For my second summer back at Midmark, my duties are similar to those of the prior summer, but with a few additions. Because I am a returning intern, I have been put into a position of guidance over the other interns. It will be my duty to assist them in training and help them with any day to day tasks. On top of this, I will again be helping setup and fix computer systems, both software and hardware issues, as needed."
    }, {
        title: "Development Team Apprentice",
        company: "the Digital Corps",
        location: "Ball State University, Muncie, IN",
        start: "Jan 2015",
        end: "May 2015",
        contact: "Brian O'Conner",
        contactEmail: "bpoconner.bsu@gmail.com",
        description: "As a Digital Corp Apprentice on the Development Team, I am currently being trained on many skills, including UNIX terminal, iOS, Android, Front-End Web, and Back-End Web development. After completing my training, I recieved a promotion to specialist, a title I will begin holding next Fall when school resumes."
    }, {
        title: "Information Technology Intern",
        company: "Midmark",
        location: "Versailles, OH",
        start: "May 2014",
        end: "Aug 2014",
        contact: "Nicole Robbins",
        contactEmail: "nrobbins@midmark.com",
        description: "As an IT Intern at Midmark, my duties were far and wide. A days work could range anywhere from new system setup to creating a batch script to automate a process. Overall, the duties consisted of computer imaging, hardware and software setup, changing networking cables to accompany moving/new teammates, creating deployable software packages, making batch programs to automate tasks, cleaning up and placing systems in an Active Directory, gathering system information for all company assets, and documenting new/improved procedures to make tasks simpler. Beyond this, I also participated in multiple projects, the first of which was organizing and setting up an inventory system for the IT Stock Room. Later on, I was placed at the head of deploying and initiating the remote backups of every corporate laptop, a task which I diligently worked on until my last day. In the end, working at Midmark was a very enjoyable experience that taught me a lot about how technology interacts in the corporate setting."
    }, {
        title: "Computer Service Technician",
        company: "Housing & Residence Life",
        location: "Ball State University, Muncie, IN",
        start: "Aug 2014",
        end: "Jan 2015",
        contact: "Brandon Dollar",
        contactEmail: "bldollar@bsu.edu",
        description: "As a Computer Service Technician for Housing and Residence Life, I was responsible for upkeep and repair for all computers, printers, and related items in residence halls, buildings, and for off campus students. Jobs would vary from simple software fixes to hardware repair/replacement."
    }, {
        title: "Programming Lab Assitant",
        company: "the Computer Science Department",
        location: "Ball State University, Muncie, IN",
        start: "Jan 2014",
        end: "May 2014",
        contact: "Dr. Jeff Zhang",
        contactEmail: "01y0zhang@bsu.edu",
        description: "As a computer Science teacher's aid, I was expected to help students in Python programming labs and outside of class, as well as aid in grading projects."
    }]
};