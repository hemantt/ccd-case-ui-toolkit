import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MediaViewerComponent } from './media-viewer.component';
import { DocumentUrlPipe } from './document-url.pipe';
import { MediaViewerModule } from '@hmcts/media-viewer';
import { WindowService } from '../../../services/window';
import { AbstractAppConfig } from '../../../../app.config';
import createSpyObj = jasmine.createSpyObj;

const GATEWAY_DOCUMENT_URL = 'http://localhost:1234/documents';
const REMOTE_DOCUMENT_URL = 'https://www.example.com/binary';
const MEDIA_VIEWER_DATA = {
  document_binary_url: GATEWAY_DOCUMENT_URL,
  document_filename: 'sample.pdf',
  content_type: 'pdf',
};

describe('MediaViewerComponent', () => {

  let component: MediaViewerComponent;
  let fixture: ComponentFixture<MediaViewerComponent>;
  let windowService;
  let mockAppConfig: any;

  beforeEach(async(() => {
    mockAppConfig = createSpyObj<AbstractAppConfig>('AppConfig', ['getDocumentManagementUrl', 'getRemoteDocumentManagementUrl']);
    mockAppConfig.getDocumentManagementUrl.and.returnValue(GATEWAY_DOCUMENT_URL);
    mockAppConfig.getRemoteDocumentManagementUrl.and.returnValue(REMOTE_DOCUMENT_URL);
    windowService = createSpyObj('windowService', ['setLocalStorage', 'getLocalStorage', 'removeLocalStorage']);
    TestBed.configureTestingModule({
      imports: [
        MediaViewerModule
      ],
      declarations: [
        MediaViewerComponent,
        DocumentUrlPipe
      ],
      providers: [
        { provide: AbstractAppConfig, useValue: mockAppConfig },
        { provide: WindowService, useValue: windowService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create media viewer component', () => {
    expect(component).toBeTruthy();
  });

  it('should load media viewer data from local storage', () => {
    windowService.getLocalStorage.and.returnValues(JSON.stringify(MEDIA_VIEWER_DATA));
    fixture.detectChanges();
    expect(component).toBeTruthy();
    component.ngOnInit();
    expect(component.mediaURL).toBe(GATEWAY_DOCUMENT_URL);
    expect(component.mediaFilename).toBe('sample.pdf');
    expect(component.mediaContentType).toBe('pdf');
  });

});