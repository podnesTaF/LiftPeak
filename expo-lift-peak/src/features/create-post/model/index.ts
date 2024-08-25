type BlockType = 'title' | 'subtitle' | 'text' | 'image' | 'exercise' | "workout";

interface BaseBlock {
    id: string;
    type: BlockType;
}

interface TextBlock extends BaseBlock {
    type: 'title' | 'subtitle' | 'text' | 'exercise' | "workout";
    content: string;
}

interface ImageBlock extends BaseBlock {
    type: 'image';
    content: string;
}



type Block = TextBlock | ImageBlock;
