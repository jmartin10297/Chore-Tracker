const people = [
    {
        id: 1,
        name: "Jordan",
        active: true
    },
    {
        id: 2,
        name: "Peyton",
        active: true
    },
    {
        id: 3,
        name: "Lincoln",
        active: true
    },
    {
        id: 4,
        name: "Baby 2",
        active: false
    }
];

const rotationGroups = {
    jordanOnly: [1],
    peytonOnly: [2],
    lincolnOnly: [3],
    baby2Only: [4],
    parents: [1, 2],
    kids: [3, 4],
    everyone: [1, 2, 3, 4]
};