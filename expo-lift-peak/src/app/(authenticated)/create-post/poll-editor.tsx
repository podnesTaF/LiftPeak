import React, {useState} from 'react';
import {Stack, useLocalSearchParams, useRouter} from "expo-router";
import Button from "@shared/components/Button";
import {ScrollView, Text, View, StyleSheet, TouchableOpacity} from "react-native";
import {Colors, defaultStyles} from "@shared/styles";
import {Block, IAnswerBlock} from "@features/create-post/model";
import {usePostStore} from "@features/create-post/store/postStore";
import {v4 as uuidv4} from "uuid";
import InputField from "@shared/components/form/InputField";
import {Ionicons} from "@expo/vector-icons";
import Checkbox from "expo-checkbox";

const PollEditor = () => {
    const router = useRouter()
    const {id, insertAt} = useLocalSearchParams<{ id?: string, insertAt?: string }>();
    const {getPollBlockById, addBlock, setBlocks, blocks, updateBlock} = usePostStore()
    const [answers, setAnswers] = useState<IAnswerBlock[]>(getPollBlockById(id)?.poll?.answers || [{
        id: uuidv4() + 1,
        name: ""
    }, {
        id: uuidv4() + 2,
        name: ""
    }]);
    const [question, setQuestion] = useState(getPollBlockById(id)?.poll?.question || '')
    const [isAnonymous, setIsAnonymous] = useState<boolean>(getPollBlockById(id)?.poll?.isAnonymous || false);
    const [multipleAnswer, setMultipleAnswer] =  useState<boolean>(getPollBlockById(id)?.poll?.multipleAnswer || false);

    const createPoll = () => {
        const newBlock: Block = {
            id: id || uuidv4(),
            type: "poll",
            content:'',
            poll: {
                question,
                answers: answers,
                isAnonymous,
                multipleAnswer
            }
        };

        if(id) {
            updateBlock(id, newBlock);
        } else if (!insertAt) {
            addBlock(newBlock);
        } else {
            const updatedBlocks = [
                ...blocks.slice(0, +insertAt + 1),
                newBlock,
                ...blocks.slice(+insertAt + 1),
            ];
            setBlocks(updatedBlocks);
        }


        router.back();
    }

    const onChangeAnswer = (text: string, id: string) => {
        setAnswers((prevAnswers) =>
            prevAnswers.map((answer) =>
                answer.id === id ? { ...answer, name: text } : answer
            )
        );
    }

    const addAnswer = () => {
        setAnswers(prev => [...prev, {id: uuidv4(), name: ""}])
    }

    const removeAnswer = (id: string) => {
        setAnswers(prev => prev.filter(a => a.id !== id))
    }

    return (
        <>
            <Stack.Screen options={{
                headerRight: () => (
                    <Button color={"transparent"} title={"Post"} onPress={() => createPoll()} />
                )
            }} />
            <ScrollView style={defaultStyles.container} contentContainerStyle={{paddingVertical: 12, gap: 12}}>
                <View style={{backgroundColor: Colors.dark700, paddingVertical: 16, paddingHorizontal: 12, gap: 20}}>
                    <InputField value={question} onChange={setQuestion} placeholder={"Enter Poll Question"} label={"Question"} />
                    <View style={{gap: 14}}>
                        <Text style={defaultStyles.secondaryText}>
                            Answers
                        </Text>
                        {answers.map((answer, index) => (
                           <View style={styles.checkboxContainer} key={answer.id}>
                               <InputField placeholder={"Answer " + (index+1)} value={answer.name} onChange={(text) => onChangeAnswer(text, answer.id)}/>
                               <TouchableOpacity onPress={() => removeAnswer(answer.id)} >
                                   <Ionicons name={"remove-outline"} size={20} color={Colors.dark300} />
                               </TouchableOpacity>
                           </View>
                        ))}
                        <Button color={"dark500"} onPress={addAnswer} title={"Add Answer"} style={{width: "50%"}}>
                            <Ionicons name={"add-outline"} size={20} color={"white"} />
                        </Button>
                    </View>
                </View>
                <View style={{backgroundColor: Colors.dark700, paddingVertical: 16, paddingHorizontal: 12, gap: 20}}>
                    <Text style={defaultStyles.secondaryText}>
                        Settings
                    </Text>
                    <TouchableOpacity onPress={() => setIsAnonymous(!isAnonymous)} style={styles.checkboxContainer}>
                        <Checkbox
                            value={isAnonymous}
                            onValueChange={(value) => setIsAnonymous(value)}
                            color={Colors.success}
                            style={{ marginRight: 8 , borderRadius: 100, width: 24, height: 24}}
                        />
                        <Text style={{color: "white", fontSize: 15}}>
                            Anonymous poll
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setMultipleAnswer(!multipleAnswer)} style={styles.checkboxContainer}>
                        <Checkbox
                            value={multipleAnswer}
                            onValueChange={(value) => setMultipleAnswer(value)}
                            color={Colors.success}
                            style={{ marginRight: 8 , borderRadius: 100, width: 24, height: 24}}
                        />
                        <Text style={{color: "white", fontSize: 15}}>
                            Multiply options
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: "row",
        alignItems: 'center',
        gap: 8
    }
})

export default PollEditor;