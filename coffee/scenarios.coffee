scores =
    smooth      : 15
    bad_ass     : 10
    sweet       : 5
    awkward     : 0
    just_bad    : -5
    offensive   : -10

window.SCENARIOS =
    "rough_year" :
        prompt  : "Hey, Jean. Heard you've been having a rough year. How have you been holding up?"
        actions : [
                label   : "God gave me a great body, and it is my duty to take care of my physical temple."
                score   : scores.smooth
            ,
                label   : "BADASS PLACEHOLDER***"
                score   : scores.bad_ass
            ,
                label   : "I'm one of the most sensitive human beings on Earth, and I know it."
                score   : scores.sweet
            ,
                label   : "A cookie has no soul, it's just a cookie. But before it was milk and eggs. And in eggs there's the potential for life."
                score   : 0
            ,
                label   : "Obviously I've done drugs."
                score   : scores.just_bad
            ,
                label   : "My wife is not my best sexual partner, but she's good with the housework."
                score   : scores.offensive
        ]

    "conversational" :
        prompt  : "PLACEHOLDER PROMPT FROM KYLIE***"
        actions : [
              label : "I am the Fred Astaire of karate."
              score : scores.smooth
            ,
              label : "I love challenges. If you don't have any and can do whatever you want, then it's probably time to die."
              score : scores.bad_ass
            ,
              label : "My biggest orgasm - not in a sexual way - is to walk with my dogs on the beach."
              score : scores.sweet
            ,
              label : "[Do a split]"
              score : 0
            ,
              label : "I am fascinated by air. If you remove the air from the sky, all the birds would fall to the ground. And all the planes, too."
              score : scores.just_bad
            ,
              label : "Calm the fuck down."
              score : scores.offensive
        ]

    "leaving_thailand" :
        prompt  : "The director is ready. Back to work! I can't wait to leave Thailand."
        actions : [
              label : "Let me show you MY Thailand. [smoulder]"
              score : scores.smooth
            ,
              label : "Now, who wants to go home... and who wants to go with ME?"
              score : scores.bad_ass
            ,
              label : "SWEET PLACEHOLDER***"
              score : scores.sweet
            ,
              label : "Perhaps I shouldn't repeat this conversation."
              score : 0
            ,
              label : "Our friends who have died here will have died for nothing."
              score : scores.just_bad
            ,
              label : "The only way you're leaving is over my dead body."
              score : scores.offensive
        ]

    "villainy" :
        prompt  : "For you, the day Raul Julia graced your presence was the most important day of your life. But for me, it was Tuesday."
        actions : [
              label : "I love playing the villain, but a villian with class."
              score : scores.smooth
            ,
              label : "[Sock Raul in the jaw while flexing]"
              score : scores.bad_ass
            ,
              label : "SWEET PLACEHOLDER***"
              score : scores.sweet
            ,
              label : "[ANIMAL HOWL]"
              score : 0
            ,
              label : "Bison. Are you man enough to fight me?"
              score : scores.just_bad
            ,
              label : "OFFENSIVE PLACEHOLDER***"
              score : scores.offensive
        ]

    "fellow_warrior" :
        prompt  : "Why do you address a fellow warrior with such disrespect?"
        actions : [
              label : "Welcome to the Shadaloo front. You're just in time for the kickoff."
              score : scores.smooth
            ,
              label : "I'm going to kick your son-of-a-bitch ass so HARD... that the next Bison wanna-be is gonna feel it."
              score : scores.bad_ass
            ,
              label : "How many children have you orphaned this week?"
              score : scores.sweet
            ,
              label : "AWKWARD PLACEHOLDER***"
              score : 0
            ,
              label : "You're discharged . . . Sarge."
              score : scores.just_bad
            ,
              label : "OFFENSIVE PLACEHOLDER***"
              score : scores.offensive
        ]

    "dying_raul" :
        prompt  : "Kylie...I'm....dying..."
        actions : [
              label : "Go home, be a family man!"
              score : scores.smooth
            ,
              label : "It's the Collection Agency, Raul. Your ass is six months over due, and it's mine."
              score : scores.bad_ass
            ,
              label : "SWEET PLACEHOLDER***"
              score : scores.sweet
            ,
              label : "AWKWARD PLACEHOLDER***"
              score : 0
            ,
              label : "No...You've lost your balls!"
              score : scores.just_bad
            ,
              label : "[round house kick]"
              score : scores.offensive
        ]
