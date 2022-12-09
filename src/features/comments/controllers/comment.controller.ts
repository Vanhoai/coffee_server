import { Controller, Delete, Get, HttpStatus, Next, Post, Req, Res } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { HttpResponse } from 'src/utils/HttpResponse';
import { CommentService } from '../services/comment.service';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) {}

    @Get()
    async getAllComments(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<void> {
        try {
            const comments = await this.commentService.getAllComments();
            res.status(HttpStatus.OK).json(
                HttpResponse.result('Get all comments successfully', HttpStatus.OK, comments),
            );
        } catch (error) {
            next(error);
        }
    }

    @Get('/:id')
    async getCommentById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const comment = await this.commentService.getCommentById(+id);
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Get comment by id successfully', HttpStatus.OK, comment));
        } catch (error) {
            next(error);
        }
    }

    @Post('')
    async createComment(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { userId, productId, content, rating } = req.body;
            const comment = await this.commentService.createComment({ userId, productId, content, rating });
            if (!comment) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Create comment failed', HttpStatus.BAD_REQUEST));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Create comment successfully', HttpStatus.OK, comment));
        } catch (error) {
            next(error);
        }
    }

    @Delete('/:id')
    async deleteComment(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<any> {
        try {
            const { id } = req.params;
            const comment = await this.commentService.deleteComment(+id);
            if (!comment) {
                return res
                    .status(HttpStatus.BAD_REQUEST)
                    .json(HttpResponse.result('Delete comment failed', HttpStatus.BAD_REQUEST));
            }
            return res
                .status(HttpStatus.OK)
                .json(HttpResponse.result('Delete comment successfully', HttpStatus.OK, comment));
        } catch (error) {
            next(error);
        }
    }
}
