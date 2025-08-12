
"use client";

import { DragDropContext, Droppable, Draggable, type DropResult } from 'react-beautiful-dnd';
import { Button } from "@/components/ui/button";
import { GripVertical, FileText, Eye, EyeOff, Trash2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { type Chapter } from '@/app/stories/[slug]/edit/page';

interface ChapterListDndProps {
    chapters: Chapter[];
    activeChapterId: string | null;
    onDragEnd: (result: DropResult) => void;
    setActiveChapterId: (id: string) => void;
    handleTogglePublish: (id: string) => void;
    handleDeleteChapter: (id: string) => void;
}

export default function ChapterListDnd({
    chapters,
    activeChapterId,
    onDragEnd,
    setActiveChapterId,
    handleTogglePublish,
    handleDeleteChapter
}: ChapterListDndProps) {
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="chapters">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="p-2 space-y-1">
                        {chapters.map((chapter, index) => (
                             <Draggable key={chapter.id} draggableId={chapter.id} index={index}>
                                {(provided, snapshot) => (
                                    <div 
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={cn(
                                            "group flex items-center justify-between p-2 rounded-md hover:bg-muted cursor-pointer",
                                            activeChapterId === chapter.id && "bg-muted",
                                            snapshot.isDragging && "bg-primary/20 shadow-lg"
                                        )}
                                        onClick={() => setActiveChapterId(chapter.id)}
                                    >
                                        <div className="flex items-center gap-2 overflow-hidden">
                                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab flex-shrink-0" />
                                            <FileText className="h-4 w-4 flex-shrink-0" />
                                            <span className="truncate">{chapter.title}</span>
                                        </div>
                                        <div className="flex items-center flex-shrink-0">
                                            <Badge variant={chapter.isPublished ? "secondary" : "outline"} className="mr-2 h-5">
                                                {chapter.isPublished ? 'Published' : 'Draft'}
                                            </Badge>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleTogglePublish(chapter.id);}} title={chapter.isPublished ? "Unpublish" : "Publish"}>
                                                {chapter.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/70 hover:text-destructive opacity-0 group-hover:opacity-100" onClick={(e) => { e.stopPropagation(); handleDeleteChapter(chapter.id)}}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}
