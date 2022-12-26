import {Router} from "express";
import ScoreCard from "../models/ScoreCard";

const router=Router();
router.delete("/cards",async (req, res)=>{
    try{
        await ScoreCard.deleteMany({});
        console.log("Database deleted");
        res.send({message: "Database cleared"})
    }catch (e){
        throw new Error("Database deletion failed");
    }
});
router.post("/card",async (req, res) => {
    try{
        const name=req.body.name;
        const subject=req.body.subject;
        const score=req.body.score;
        const existing=await ScoreCard.findOne({"name":name, "subject":subject});
        if(existing && (existing.subject===subject)){
            existing.score=score;
            const Newexisting=await ScoreCard.find({"name":name});
            res.send({message:("Updating("+name+","+subject+","+score+")"), card: Newexisting});
            return existing.save();
        }
        else{
            const newScoreCard=new ScoreCard({name,subject,score});
            console.log("Create NewScoreCard: ",newScoreCard);
            res.send({message:("Adding("+name+","+subject+","+score+")"), card: newScoreCard});
            return newScoreCard.save();
        }
    }catch (e){
        throw new Error("User Creation error: "+e);
    }
    
    

});
router.get("/cards", async (req,res) => {
    const qtype=req.query.type;
    const qstring=req.query.queryString;
    if(qtype==="name"){
        const name=qstring;
        const existing=await ScoreCard.find({"name":name});
        if(!(existing.length===0)){
            let newExisting=[];
            for(let i=0; i<existing.length; i++){
                newExisting[i]="Found card with name: ("+existing[i].name+","+existing[i].subject+","+existing[i].score+")";
            }
            res.send({messages: newExisting, card: existing});
        }
        else{
            res.send({messages: false, message: "Name("+name+") not found!", card: false});
        }
    }
    else{
        const subject=qstring;
        const existing=await ScoreCard.find({"subject":subject});
        if(!(existing.length===0)){
            let newExisting=[];
            for(let i=0; i<existing.length; i++){
                newExisting[i]="Found card with subject: ("+existing[i].name+","+existing[i].subject+","+existing[i].score+")";
            }
            res.send({messages: newExisting, card: existing});
        }
        else{
            res.send({messages: false, message: "Subject("+subject+") not found!"});
        }
    }
});


router.get('/findCards', async (req,res) => {
    const qtype=req.query.type;
    const qstring=req.query.target;
    if(qtype==="name"){
        const name=qstring;
        const existing=await ScoreCard.find({"name":name});
        let existing_array=[];
        for(let i=0; i<existing.length; i++){
            existing_array[i]={name: existing[i].name, subject: existing[i].subject, score: existing[i].score};
        }
        res.send({array: existing_array});
    }
    else{
        const subject=qstring;
        const existing=await ScoreCard.find({"subject":subject});
        res.send({list_item: existing})
    }
})




export default router;