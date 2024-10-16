import React, { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'; // Make sure this build is installed

export default function MyEditor({ initialData, onChange }) {
  const [editorData, setEditorData] = useState(initialData);

  useEffect(() => {
    setEditorData(initialData);
  }, [initialData]);

  return (
    <CKEditor
      editor={ClassicEditor}
      data={editorData}
      config={{
        toolbar: [
          'undo',
          'redo',
          '|',
          'heading',
          '|',
          'bold',
          'italic',
          '|',
          'link',
          'insertTable',
          'mediaEmbed',
          '|',
          'bulletedList',
          'numberedList',
          'indent',
          'outdent',
        ],
      }}
      onChange={(event, editor) => {
        const data = editor.getData();
        setEditorData(data);
        onChange(data);
      }}
    />
  );
}
