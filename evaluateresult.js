const getScore = (response, answers) => {
    let score = 0;
    for(const ans in response) {
        if(parseInt(ans)) {
            const answer = answers.find(item => item.id === parseInt(ans));
            if(!answer) throw new Error('Incorrect Data recieved');
            if(answer.ans === response[ans]) score++;
        }
    }
    return score;
}

export default getScore;