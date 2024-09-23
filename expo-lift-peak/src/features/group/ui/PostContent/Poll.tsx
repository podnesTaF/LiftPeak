import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import Checkbox from "expo-checkbox";
import {useAuthStore} from "@features/auth";
import {IAnswer, IPoll} from "@entities/post/model/IPoll";
import {Ionicons} from "@expo/vector-icons";



const Poll = ({poll}: {poll: IPoll}) => {
    const {user} = useAuthStore()
    const [totalVotes, setTotalVotes] = useState<number>(poll.answers.reduce((acc, curr) => acc + (curr.voters?.length || 0), 0))
    const [votedId, setVotedId] = useState<number | undefined>(poll.currentUserVoteAnswerId)

    return (
        <View style={{gap: 14, paddingVertical: 10}}>
            <View style={{gap: 6}}>
                <Text style={{color:"white", fontWeight: "500", fontSize: 16}}>
                    {poll.question}
                </Text>
                <View style={defaultStyles.row}>
                    <Text style={defaultStyles.secondaryText}>
                        {poll.isAnonymous ? "Anonymous" : "Open"} poll
                    </Text>
                    <Text style={defaultStyles.secondaryText}>
                        {poll.answers.reduce((acc, curr) => acc + (curr.voters?.length || 0), 0)} voters
                    </Text>
                </View>
            </View>
            {poll.answers.map((a) => (
               <PollIndicator answer={a} votedId={votedId} onChangeVote={(id) => setVotedId(id)}  totalVotes={totalVotes} />
            ))}
        </View>
    );
};


const PollIndicator = ({answer, votedId, onChangeVote, totalVotes}: {answer: IAnswer, votedId?: number, onChangeVote: (answerId: number) => void , totalVotes: number}) => {
    return (
        <>
            <View style={{flexDirection: "row", gap: 10, alignItems: "center"}}>
                {!votedId ? (
                    <Checkbox value={votedId === answer.id} onChange={() => onChangeVote(answer.id)} color={Colors.dark300}/>
                ) : (
                    votedId === answer.id && (
                        <TouchableOpacity>
                            <Ionicons name={"checkmark"} color={Colors.success} size={24} />
                        </TouchableOpacity>
                    )
                )}
                <Text style={{color:"white", fontSize: 16}}>
                    {answer.name}
                </Text>
                <View style={{flex: 1, alignItems: 'flex-end'}}>
                  <Text style={{color:"white", fontSize: 16}}>
                      {((totalVotes / answer.voters.length) * 100).toFixed(0)}%
                  </Text>
                </View>
            </View>
            {votedId && (
                <View style={{borderRadius: 3, height:5, width: "100%", backgroundColor: Colors.dark500}}>
                    <View style={{borderRadius: 3, height: 5, width: Math.round((totalVotes / answer.voters.length) * 100), backgroundColor: Colors.success}}>
                    </View>
                </View>
            )}
        </>
    )
}


export default Poll;