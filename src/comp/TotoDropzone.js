import React, { Component } from 'react';
import TotoIconButton from './TotoIconButton';
import TotoEventBus from '../services/TotoEventBus';
import * as config from '../Config';

import './TotoDropzone.css';

import uploadImg from '../img/upload-cloud.svg';
import dropImg from '../img/add-file.svg';

import confirm from '../img/tick.svg';
import close from '../img/close.svg';

export default class TotoDropzone extends Component {

  constructor(props) {
    super(props)

    this.state = {
      hightlight: false,
      files: null
    }

    this.fileInputRef = React.createRef()

    this.openFileDialog = this.openFileDialog.bind(this)
    this.onFilesAdded = this.onFilesAdded.bind(this)
    this.onDragOver = this.onDragOver.bind(this)
    this.onDragLeave = this.onDragLeave.bind(this)
    this.onDrop = this.onDrop.bind(this)
    this.reset = this.reset.bind(this)
    this.confirm = this.confirm.bind(this)
  }

  /**
   * When mounting
   */
  componentDidMount() {
    TotoEventBus.subscribeToEvent(config.EVENTS.totoDropzoneClearFilesRequested, this.reset);
  }

  /**
   * When unmounting
   */
  componentWillUnmount() {
    TotoEventBus.unsubscribeToEvent(config.EVENTS.totoDropzoneClearFilesRequested, this.reset);
  }

  openFileDialog() {

    if (this.props.disabled) return
    if (this.props.uploading) return

    this.fileInputRef.current.click()
  }

  /**
   * Files added by opning the file picker
   */
  onFilesAdded(evt) {

    if (this.props.disabled) return
    if (this.props.uploading) return

    const files = evt.target.files
    let array = this.fileListToArray(files);

    // Add the files
    this.setState({files: array});

    if (this.props.onFilesAdded) this.props.onFilesAdded(array)
  }

  onDragOver(evt) {

    evt.preventDefault()

    if (this.props.disabled) return
    if (this.props.uploading) return

    this.setState({ hightlight: true })
  }

  onDragLeave() {
    this.setState({ hightlight: false })
  }

  /**
   * Files dropped in the zone
   */

  onDrop(event) {
    event.preventDefault()

    if (this.props.disabled) return
    if (this.props.uploading) return

    const files = event.dataTransfer.files
    let array = this.fileListToArray(files);

    // Add the files
    this.setState({files: array});

    if (this.props.onFilesAdded) this.props.onFilesAdded(array)

    this.setState({ hightlight: false })
  }

  /**
   * Create array of files
   */
  fileListToArray(list) {
    let array = []
    for (var i = 0; i < list.length; i++) {
      array.push(list.item(i))
    }
    return array
  }

  /**
   * Resets
   */
  reset() {

    // Remove the files
    this.setState({files: null});

    // Clear the input field
    this.fileInputRef.current.value = null;

    // In case someone is interested..
    if (this.props.onReset) this.props.onReset();

  }

  /**
   * Confirms that the files can be uploaded
   */
  confirm() {

    // Call whose intereseted
    if (this.props.onConfirmedUpload) this.props.onConfirmedUpload(this.state.files);

  }

  render() {

    // Wings
    let wingClass = "wing";
    if (this.state.files == null) wingClass += ' hidden';
    if (this.props.uploading) wingClass += ' disabled';

    // Dropzone
    let dropzoneContainerClass = 'toto-dropzone';
    if (this.props.uploading) dropzoneContainerClass += ' uploading';

    // Image
    let img;
    if (this.state.files != null) img = (<img alt="upload" className="icon" src={uploadImg} />)
    else img = (<img alt="upload" className="icon" src={dropImg} />)

    return (
      <div className='toto-file-upload'>

        <div className={wingClass + ' left'}>
          <TotoIconButton image={confirm} onPress={this.confirm} disabled={this.props.uploading} size='l'/>
        </div>

        <div className={dropzoneContainerClass}>
          <div
            className={`Dropzone ${this.state.hightlight ? 'Highlight' : ''}`}
            onDragOver={this.onDragOver}
            onDragLeave={this.onDragLeave}
            onDrop={this.onDrop}
            onClick={this.openFileDialog}
            style={{ cursor: this.props.disabled ? 'default' : 'pointer' }}
          >
            <input ref={this.fileInputRef} className="FileInput" type="file" multiple onChange={this.onFilesAdded} />

            {img}
          </div>
        </div>

        <div className={wingClass + ' right'}>
          <TotoIconButton image={close} onPress={this.reset} size='l'/>
        </div>

     </div>
    )
  }
}
