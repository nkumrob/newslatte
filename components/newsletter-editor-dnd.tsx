'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Newsletter, Section } from '@/types/newsletter';
import { GripVertical, Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SortableSectionProps {
  section: Section;
  index: number;
  onUpdate: (index: number, field: keyof Section, value: any) => void;
  onDelete: (index: number) => void;
}

function SortableSection({ section, index, onUpdate, onDelete }: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `section-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-10 top-8 cursor-move p-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>

        {/* Section Content */}
        <div className="flex-1 bg-white border-2 border-transparent hover:border-blue-300 rounded-lg transition-all">
          <div className="px-6 py-8">
            <input
              type="text"
              value={section.title}
              onChange={(e) => onUpdate(index, 'title', e.target.value)}
              className="text-2xl font-semibold text-gray-900 mb-4 w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
              placeholder="Section Title"
            />
            
            {section.description !== undefined && (
              <textarea
                value={section.description || ''}
                onChange={(e) => onUpdate(index, 'description', e.target.value)}
                className="text-gray-600 mb-6 w-full resize-none bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                rows={3}
                placeholder="Section description..."
              />
            )}
            
            {section.cta && (
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Button:</span>
                  <input
                    type="text"
                    value={section.cta.text}
                    onChange={(e) => onUpdate(index, 'cta', { ...section.cta!, text: e.target.value })}
                    className="inline-block bg-black text-white px-6 py-3 rounded-full text-sm font-medium"
                    placeholder="Button Text"
                  />
                </div>
                <div className="flex items-center flex-1">
                  <span className="text-sm text-gray-500 mr-2">URL:</span>
                  <input
                    type="text"
                    value={section.cta.url}
                    onChange={(e) => onUpdate(index, 'cta', { ...section.cta!, url: e.target.value })}
                    className="flex-1 text-sm text-gray-600 bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(index)}
            className="absolute top-2 right-2 p-2 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

interface DraggableEditorProps {
  newsletter: Newsletter;
  onUpdate: (newsletter: Newsletter) => void;
}

export function DraggableEditor({ newsletter, onUpdate }: DraggableEditorProps) {
  const [sections, setSections] = useState(newsletter.content.sections);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((_, i) => `section-${i}` === active.id);
      const newIndex = sections.findIndex((_, i) => `section-${i}` === over.id);
      
      const newSections = arrayMove(sections, oldIndex, newIndex);
      setSections(newSections);
      
      onUpdate({
        ...newsletter,
        content: {
          ...newsletter.content,
          sections: newSections
        }
      });
    }
  };

  const updateSection = (index: number, field: keyof Section, value: any) => {
    const newSections = sections.map((section, i) => 
      i === index ? { ...section, [field]: value } : section
    );
    setSections(newSections);
    
    onUpdate({
      ...newsletter,
      content: {
        ...newsletter.content,
        sections: newSections
      }
    });
  };

  const deleteSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    
    onUpdate({
      ...newsletter,
      content: {
        ...newsletter.content,
        sections: newSections
      }
    });
  };

  const addSection = () => {
    const newSection: Section = {
      title: 'New Section',
      type: 'headline',
      description: 'Enter your content here',
      cta: {
        text: 'Learn More',
        url: '#'
      }
    };
    
    const newSections = [...sections, newSection];
    setSections(newSections);
    
    onUpdate({
      ...newsletter,
      content: {
        ...newsletter.content,
        sections: newSections
      }
    });
  };

  return (
    <div className="max-w-[700px] mx-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sections.map((_, i) => `section-${i}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {sections.map((section, index) => (
              <SortableSection
                key={`section-${index}`}
                section={section}
                index={index}
                onUpdate={updateSection}
                onDelete={deleteSection}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* Add Section Button */}
      <div className="mt-6">
        <button
          onClick={addSection}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 flex items-center justify-center gap-2 text-gray-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          Add New Section
        </button>
      </div>
    </div>
  );
}