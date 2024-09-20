import {Block, PollBlock} from "@features/create-post/model";
import {create} from "zustand";
import {v4 as uuidv4} from "uuid";
import {TextType} from "@entities/post";

interface PostState {
    groupId: number | null;
    blocks: Block[];
    addBlock: (block: Block, insertAt?: number) => void;
    removeBlock: (blockId: string) => void;
    updateBlock: (id: string,  newBlock: Block) => void;
    setBlocks: (blocks: Block[]) => void;
    getPollBlockById: (blockId?: string) => PollBlock | undefined;
    clearStore: () => void;
}

export const usePostStore = create<PostState>((set, get) => ({
   groupId: null,
   blocks: [{ id: uuidv4(), type: TextType.TITLE, content: '' },
       { id: uuidv4(), type: TextType.TEXT, content: '' }],
    addBlock: (block, insertAt?: number) => {
        if (insertAt !== undefined) {
            const updatedBlocks = [
                ...get().blocks.slice(0, insertAt + 1),
                block,
                ...get().blocks.slice(insertAt + 1),
            ];
            set({ blocks: updatedBlocks });
        } else {
            set({ blocks: [...get().blocks, block] });
        }
    },
    removeBlock: (blockId) => {
        set({ blocks: get().blocks.filter((b) => b.id !== blockId) });
    },
    setBlocks: (blocks: Block[]) => {
        set({ blocks });
    },
    getPollBlockById: (blockId) => {
       return get().blocks.find(b => b.id === blockId) as PollBlock
    },
    updateBlock: (id: string, newBlock: Block) => {
        set({
            blocks: get().blocks.map((block) =>
                block.id === id ? newBlock : block
            ),
        });
    },
    clearStore: () => {
       set({
           groupId: null,
           blocks: [{ id: uuidv4(), type: TextType.TITLE, content: '' },
               { id: uuidv4(), type: TextType.TEXT, content: '' }]
       })
    }
}))