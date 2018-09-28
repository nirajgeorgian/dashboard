import gym_logo from '../../assests/img/gym_icon.jpg'
import swimming from '../../assests/img/swimming.jpg'

export const Buildings = [
    {
        bid: 'e1c9',
        building_name: 'Main Building',
        building_description: 'Main Building of the Gym',
        building_rules: [
            '1. We have a PROFESSIONAL COACH who trains with the teams for two hours on a Monday. The committee works alongside the coach for our social tennis sessions on a Thursday between 6 - 8pm playing a mixture of games and matches to accommodate all abilities.',
	        '2. During FRESHERS WEEKS, come and see us at the Sports Fayre where you can sign up and speak to members of the committee as well as have a hit on our mini net on the grass outside.'
        ],
        building_accessibility: [ "wheelchair","shower","medkit"],
        facilities: [
            {
                fname: 'Gym Room',
                logo: gym_logo,
                brief: 'All members must carry a hand towel when training. You cannot be on the gym floor or partake in a class unless you carry a hand towel. This is for hygiene reasons to wipe down the equipment and mats after use. We also strongly recommend everyone to carry water when exercising.',
                note: 'We have shower facility available at the ground floor if you need them.',
                activity: 'Gym',
                fid: 260
            }
        ]
    },
    {   
        bid: '1234',
        building_name: 'Swimming Hall',
        building_description: 'Swimming pools of our club',
        building_rules: [
            '1. We have a PROFESSIONAL COACH who trains with the teams for two hours on a Monday. The committee works alongside the coach for our social tennis sessions on a Thursday between 6 - 8pm playing a mixture of games and matches to accommodate all abilities.',
	        '2. During FRESHERS WEEKS, come and see us at the Sports Fayre where you can sign up and speak to members of the committee as well as have a hit on our mini net on the grass outside.'
        ],
        building_accessibility: [ "wheelchair", "car"],
        facilities: [
            {
                fname: 'Swimming Pool 1 - Beginners & Kids ',
                logo: swimming,
                brief: 'All members must carry a hand towel when training. You cannot be on the gym floor or partake in a class unless you carry a hand towel. This is for hygiene reasons to wipe down the equipment and mats after use. We also strongly recommend everyone to carry water when exercising.',
                note: 'The swimming pool is only for beginner and kid members',
                activity: 'Football',
                fid: 290
            },
            {
                fname: 'Swimming Pool 2 - Adults',
                logo: swimming,
                brief: 'All members must carry a hand towel when training. You cannot be on the gym floor or partake in a class unless you carry a hand towel. This is for hygiene reasons to wipe down the equipment and mats after use. We also strongly recommend everyone to carry water when exercising.',
                note: 'This swimming pool is only for adult members.',
                activity: 'Gym'
            }
        ]
    }
]