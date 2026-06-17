<script setup lang="ts">
import { watch } from 'vue'
import * as Y from 'yjs'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import { WebrtcProvider } from 'y-webrtc'
import AppIcons from './AppIcons.vue'
import Highlight from '@tiptap/extension-highlight'
import { TextAlign } from '@tiptap/extension-text-align'
import { useQuestionnaireStorage } from '@/composables/useQuestionnaireStorage.ts'

const ydoc = new Y.Doc()
const provider = new WebrtcProvider('typepro — копия', ydoc)

const { html, setHtml } = useQuestionnaireStorage()

const props = defineProps<{
    modelValue: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
}>()

const editor = useEditor({
    content: props.modelValue,
    extensions: [StarterKit, Highlight,
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        })
    ],
    onUpdate: ({ editor }) => {
        const newHtml = editor.getHTML()
        setHtml(newHtml)
        emit('update:modelValue', newHtml)
    },
})

watch(() => props.modelValue, (newContent) => {
    if (editor.value && newContent !== editor.value.getHTML()) {
        editor.value.commands.setContent(newContent)
    }
})
</script>

<template>
    <div class="text-redactor__header">
        <div class="text-redactor__section text-redactor__section--first">
            <button class="text-redactor__section--button" @click="editor?.chain().focus().undo().run()">
                <AppIcons name="undo" class="text-redactor__section--icon"/>
            </button>
            <button class="text-redactor__section--button" @click="editor?.chain().focus().redo().run()">
                <AppIcons name="redo" class="text-redactor__section--icon"/>
            </button>
        </div>

        <div class="text-redactor__section text-redactor__section--second">
            <span>Абзац</span>
            <AppIcons name="expand-more" />
        </div>

        <div class="text-redactor__section text-redactor__section--third">
            <button class="text-redactor__section--button text-redactor__section--bold" 
            @click="editor?.chain().focus().toggleBold().run()" :class="{ 'is-active': editor?.isActive('bold') }">B</button>
            <button class="text-redactor__section--button text-redactor__section--cursive" 
            @click="editor?.chain().focus().toggleItalic().run()" :class="{ 'is-active': editor?.isActive('italic') }">I</button>
            <button class="text-redactor__section--button text-redactor__section--underlined"
            @click="editor?.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor?.isActive('underline') }">U</button>
            <button class="text-redactor__section--button text-redactor__section--striked"
            @click="editor?.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor?.isActive('strike') }">S</button>
            <button class="text-redactor__section--button">
                <AppIcons name="quotes" />
            </button>
            <button class="text-redactor__section--button text-redactor__section--highlighted"
            @click="editor?.chain().focus().toggleHighlight().run()" :class="{ 'is-active': editor?.isActive('highlight') }">
                <AppIcons name="highlight" />
            </button>
            <AppIcons name="expand-more" />
        </div>

        <div class="text-redactor__section text-redactor__section--fourth">
            <button class="text-redactor__section--button" :class="{ 'is-active': editor?.isActive({ textAlign: 'left' }) }"
            @click="editor?.chain().focus().setTextAlign('left').run()">
                <AppIcons name="align-left" />
            </button>
            <button class="text-redactor__section--button" :class="{ 'is-active': editor?.isActive({ textAlign: 'center' }) }"
            @click="editor?.chain().focus().setTextAlign('center').run()">
                <AppIcons name="align-center" />
            </button>
            <button class="text-redactor__section--button" :class="{ 'is-active': editor?.isActive({ textAlign: 'right' }) }"
            @click="editor?.chain().focus().setTextAlign('right').run()">
                <AppIcons name="align-right" />
            </button>
            <button class="text-redactor__section--button" :class="{ 'is-active': editor?.isActive({ textAlign: 'justify' }) }"
            @click="editor?.chain().focus().setTextAlign('justify').run()">
                <AppIcons name="align-justify" />
            </button>
        </div>

        <div class="text-redactor__section text-redactor__section--fifth">
            <button class="text-redactor__section--button">
                <span>● ● ●</span>
            </button>
        </div>
    </div>


    <editor-content :editor="editor"/>
</template>

<style lang="scss">
.text-redactor__header {
    max-width: 708px;
    width: 100%;
    height: 36px;
    background-color: var(--other-gray);
    border: 1px solid var(--border-gray);
    border-bottom: none;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    box-sizing: border-box;
    display: flex;
}

.text-redactor__section + .text-redactor__section {
    border-left: 1px solid var(--border-gray);
}

.text-redactor__section {
    display: flex;
    align-items: center;
    gap: 10px;

    &--button {
        border: none;
        background-color: transparent;
        padding: 2px 6px;
        margin: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &.is-active {
            background-color: var(--border-gray);
            border-radius: 4px;
        }

        &:hover {
            opacity: 0.5;
        }
    }

    &--icon {
        &:hover {
            opacity: 0.5;
        }
    }

    &--first {
        padding: 4px 8px 0;
    }

    &--second {
        width: 100px;
        justify-content: space-between;
        padding: 0 8px;
        cursor: pointer;
        font-size: 14px;
    }

    &--third {
        padding: 0 10px;
    }

    &--bold {
        font-weight: 500;
        font-size: 18px;
    }

    &--cursive {
        font-style: italic;
        font-size: 20px;
        padding-right: 8px;
    }

    &--underlined {
        text-decoration: underline;
        font-size: 18px;
    }

    &--striked {
        text-decoration: line-through;
        font-size: 18px;
    }

    &--fourth {
        padding: 0 10px;
    }
}

.text-redactor__section--button + .text-redactor__section--button {
    margin-left: 2px;
}

.ProseMirror {
    max-width: 708px;
    width: 100%;
    border: 1px solid var(--border-gray);
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    min-height: 339px;
    margin-bottom: 24px;
    padding: 28px 18px;
    box-sizing: border-box;

    &:focus {
        outline: none;
    }

    strong {
        font-weight: 600;
    }

    i, em {
        font-style: italic;
    }

    u {
        text-decoration: underline;
    }

    s {
        text-decoration: line-through;
    }

    mark {
        background-color: rgba(20, 184, 144, 0.5);
    }
}

.text-align-left { text-align: left; }
.text-align-center { text-align: center; }
.text-align-right { text-align: right; }
.text-align-justify { text-align: justify; }
</style>