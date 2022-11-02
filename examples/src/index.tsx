import './style.scss';
import React, { useState } from 'react';
import * as ReactDOM from 'react-dom';

import ReactDiff from '../../src/index';

const P = (window as any).Prism;

const Example = () => {
  const [file1, setFile1] = useState<any>('');
  const [file2, setFile2] = useState<any>('');
  const [diffCount, setDiffCount] = useState<number>(0);
  const [highlightLine, setHighlightLine] = useState<any[]>([]);

  const onLineNumberClick = (
    id: string,
    e: React.MouseEvent<HTMLTableCellElement>,
  ): void => {
    let newHighlightLine = [id];
    if (e.shiftKey && highlightLine.length === 1) {
      const [dir, oldId] = highlightLine[0].split('-');
      const [newDir, newId] = id.split('-');
      if (dir === newDir) {
        newHighlightLine = [];
        const lowEnd = Math.min(Number(oldId), Number(newId));
        const highEnd = Math.max(Number(oldId), Number(newId));
        // eslint-disable-next-line no-plusplus
        for (let i = lowEnd; i <= highEnd; i++) {
          newHighlightLine.push(`${dir}-${i}`);
        }
      }
    }
    setHighlightLine(newHighlightLine);
  };

  const showFile = async (e: any, num: number) => {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (num === 1) {
        setFile1(event.target.result);
      } else {
        setFile2(event.target.result);
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const syntaxHighlight = (str: string): any => {
    if (!str) return;
    const language = P.highlight(str, P.languages.javascript);
    // eslint-disable-next-line consistent-return
    return <span dangerouslySetInnerHTML={{ __html: language }} />;
  };

  return (
    <div className="react-diff-viewer-example">
      <div className="radial"></div>

      <div>
        <input type="file" onChange={(e) => showFile(e, 1)}/>
        <input type="file" onChange={(e) => showFile(e, 2)}/>
      </div>

      <div className="options">
        <span>{ diffCount }</span>
      </div>

      <div className="diff-viewer">
        {file1.length > 0 && file2.length > 0 && <ReactDiff
          highlightLines={highlightLine}
          onLineNumberClick={onLineNumberClick}
          oldValue={file1}
          splitView={true}
          newValue={file2}
          renderContent={syntaxHighlight}
          useDarkTheme={true}
          leftTitle="webpack.config.js master@2178133 - pushed 2 hours ago."
          rightTitle="webpack.config.js master@64207ee - pushed 13 hours ago."
          setCount={setDiffCount}
        />}
      </div>
    </div>
  );
};

ReactDOM.render(<Example />, document.getElementById('app'));
