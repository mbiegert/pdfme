import React, { useEffect, useRef, useState } from 'react';
import GitHubButton from 'react-github-btn';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import HomepageFeatures from '../components/HomepageFeatures';
import HomepageHeader from '../components/HomepageHeader';
import Divider from '../components/Divider';
import Code from '../components/Code';
import { generate, Template } from '@pdfme/generator';
import { Designer, Viewer, Form } from '@pdfme/ui';
import { getSampleTemplate, cloneDeep, getGeneratorSampleCode } from '../libs/helper';

export default function Home(): JSX.Element {
  const designerRef = useRef<HTMLDivElement | null>(null);
  const viewerRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const designer = useRef<Designer | null>(null);
  const viewer = useRef<Viewer | null>(null);
  const form = useRef<Form | null>(null);

  const [template, setTemplate] = useState<Template>(getSampleTemplate());
  const [mode, setMode] = useState<'viewer' | 'form'>('form');

  const onSaveTemplate = (t: Template) => {
    setTemplate(t);
    if (form.current) {
      form.current.updateTemplate(t);
      if (t.sampledata) {
        form.current.setInputs(cloneDeep(t.sampledata));
      }
    }
    if (viewer.current) {
      viewer.current.updateTemplate(t);
      if (t.sampledata) {
        viewer.current.setInputs(cloneDeep(t.sampledata));
      }
    }
  };

  useEffect(() => {
    if (designerRef.current) {
      designer.current = new Designer({
        domContainer: designerRef.current,
        template,
      });

      designer.current.onSaveTemplate(onSaveTemplate);

      designer.current.onChangeTemplate(() => {
        designer.current.saveTemplate();
      });
    }
  }, [designerRef]);

  useEffect(() => {
    if (viewerRef.current) {
      viewer.current = new Viewer({
        domContainer: viewerRef.current,
        template,
        inputs: cloneDeep(template.sampledata) ?? [{}],
      });
    }

    if (formRef.current) {
      form.current = new Form({
        domContainer: formRef.current,
        template,
        inputs: cloneDeep(template.sampledata) ?? [{}],
      });

      form.current.onChangeInput(console.log);
    }
  }, [viewerRef, formRef, mode]);

  const generatePDF = () => {
    generate({
      template,
      inputs: form.current.getInputs(),
    }).then((pdf) => {
      const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
      window.open(URL.createObjectURL(blob));
    });
  };

  return (
    <Layout
      title={`Free and Open source PDF generator library!`}
      description="Free and Open source PDF generator library fully written in TypeScript coming with a React based UI template editor."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <div className="container">
          <div className="row">
            <div className="col col--12 margin-vert--lg text--center">
              <Divider />
            </div>

            <div className={clsx('col col--6')}>
              <h2>
                <a aria-hidden="true" className="anchor enhancedAnchor" id="template"></a>
                Template
                <a className="hash-link" href="#template"></a>
              </h2>
              <div className="card-demo">
                <div className="card">
                  <div className="card__image">
                    <img src={'/img/template.png'} alt="Image alt text" />
                  </div>
                  <div className="card__body">
                    <h3>A template is composed by a basePdf and a Schema</h3>
                    <small>
                      Templates are at the core of pdfme. In fact a template can be used with the
                      Generator, the Form, and the Viewer.
                    </small>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--lg button--primary button--block"
                      to="/docs/getting-started#template"
                    >
                      Learn more about Templates
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div className={clsx('col col--6')}>
              <h2>
                <a aria-hidden="true" className="anchor enhancedAnchor" id="generate"></a>
                Generator
                <a className="hash-link" href="#generate"></a>
              </h2>
              <div style={{ maxHeight: 580, overflow: 'scroll' }}>
                <Code
                  code={getGeneratorSampleCode(getSampleTemplate())}
                  language="typescript"
                ></Code>
              </div>
              <div>
                <button
                  className="margin-vert--md button button--lg button--secondary button--block"
                  onClick={generatePDF}
                >
                  Generate PDF
                </button>
                <Link
                  className="margin-vert--md button button--primary button--lg button--block"
                  to="/docs/getting-started#generator"
                >
                  Learn more about the Generator
                </Link>
              </div>
            </div>

            <div className="col col--12 margin-vert--lg text--center">
              <Divider />
            </div>

            <div className={clsx('col col--12')}>
              <h2>
                <a aria-hidden="true" className="anchor enhancedAnchor" id="designer"></a>
                Designer
                <a className="hash-link" href="#designer"></a>
              </h2>
              <p>
                A template can be easily created using Designer (UI template editor). It supports
                shortcuts such as <code>Copy</code>, <code>Paste</code>, <code>Undo</code>,{' '}
                <code>Redo</code>, <code>Ruler</code>, and group selection.
              </p>
            </div>

            <div className={clsx('col col--8')}>
              <div style={{ height: 1000 }} ref={designerRef} />
            </div>
            <div className={clsx('col col--4')}>
              <div style={{ height: 1000, overflow: 'auto' }}>
                <Code code={JSON.stringify(template, null, 2).trim()} language="json" />
              </div>
            </div>
            <div className={clsx('col col--12 margin-vert--lg')}>
              <div className="text--center">
                <p>
                  It's easy to integrate with an external app.
                  <br />
                </p>
                <Link
                  className="button button--primary button--lg"
                  to="/docs/getting-started#designer"
                >
                  Learn more about the Designer
                </Link>
              </div>
            </div>
            <div className="col col--12 margin-vert--lg text--center">
              <Divider />
            </div>

            <div className={clsx('col col--4')}>
              <h2>
                <a aria-hidden="true" className="anchor enhancedAnchor" id="form-viewer"></a>
                Form / Viewer
                <a className="hash-link" href="#form-viewer"></a>
              </h2>
              <div className="card-demo">
                <div className="card">
                  <div className="card__image">
                    <img
                      src={mode === 'form' ? '/img/form.gif' : '/img/viewer.png'}
                      alt={`${mode === 'form' ? 'Form' : 'Viewer'} image`}
                    />
                  </div>
                  <div className="card__body">
                    <h3>
                      <span
                        style={{ cursor: 'pointer' }}
                        className={`${mode === 'form' ? 'text--primary' : ''}`}
                        onClick={() => setMode('form')}
                      >
                        Form
                      </span>
                      <span style={{ margin: '1rem' }}>/</span>
                      <span
                        style={{ cursor: 'pointer' }}
                        className={`${mode === 'viewer' ? 'text--primary' : ''}`}
                        onClick={() => setMode('viewer')}
                      >
                        Viewer
                      </span>
                    </h3>
                    <small>
                      {mode === 'form' ? (
                        <div>
                          Starting from a template you can generate a fillable form. Then you will
                          need a few seconds to generate a Pdf
                        </div>
                      ) : (
                        <div>
                          You can always check the filled content by using the Viewer.
                          <br />
                          Mobile browsers doesn't allow a user to view a PDF from an iframe, for
                          this reason the Viewer is the perfect solution for mobile users.
                        </div>
                      )}
                    </small>
                  </div>
                  <div className="card__footer">
                    <Link
                      className="button button--primary button--lg"
                      to={`/docs/getting-started#${mode}`}
                    >
                      Learn more about the {mode === 'form' ? 'Form' : 'Viewer'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className={clsx('col col--8')}>
              <ul className="tabs">
                <li
                  onClick={() => setMode('form')}
                  className={`tabs__item ${mode === 'form' ? 'tabs__item--active' : ''}`}
                >
                  Form
                </li>
                <li
                  onClick={() => setMode('viewer')}
                  className={`tabs__item  ${mode === 'viewer' ? 'tabs__item--active' : ''}`}
                >
                  Viewer
                </li>
              </ul>
              {mode === 'form' ? (
                <div style={{ height: 800, background: 'rgb(74, 74, 74)' }} ref={formRef}></div>
              ) : (
                <div style={{ height: 800, background: 'rgb(74, 74, 74)' }} ref={viewerRef}></div>
              )}
              <div className="margin-vert--lg text--center">
                <button className="button button--lg button--secondary" onClick={generatePDF}>
                  Generate PDF
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col col--12 margin-vert--lg text--center">
          <Divider />
        </div>
        <div className="col col--12 margin-vert--lg padding-vert--lg text--center">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ width: 'fit-content' }}>
              <div style={{ display: 'flex', maxWidth: 400 }}>
                <img src={'/img/please-star.png'} alt="pleaseStar" />
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  margin: '0.8rem',
                }}
              >
                <a
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: '10pt',
                  }}
                  href="https://github.com/pdfme/pdfme"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={'/img/github-icon.svg'} alt="github" width={25} />
                  <span style={{ marginLeft: '0.5rem' }}>https://github.com/pdfme/pdfme</span>
                </a>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ marginLeft: '0.5rem' }}>
                    <GitHubButton
                      href="https://github.com/pdfme/pdfme"
                      data-size="large"
                      data-icon="octicon-star"
                      data-show-count={true}
                      aria-label="Star pdfme on GitHub"
                    >
                      Star
                    </GitHubButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
