export class Post {
    public postId: string;
    public likes: string[]=[];
    public dislikes: string[]=[];
    public comments: { text: string, userEmail: string }[]=[];

    constructor(
        public title: string, 
        public imgPath: string,
        public description: string,
        public dateCreated: Date,
        public numberOfLikes: number,
        public numberOfDislikes: number,
        public ownerId: string,
        public userEmail: string
    ){             
        this.postId = this.generateId();
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}