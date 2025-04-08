
import React from 'react';
import { DeclarationFormData } from '@/pages/DeclarationPage';

interface DeclarationCertificateProps {
  formData: DeclarationFormData;
}

const DeclarationCertificate: React.FC<DeclarationCertificateProps> = ({ formData }) => {
  const getCountryName = (code: string) => {
    switch (code) {
      case 'KR': return '대한민국';
      case 'US': return '미국';
      case 'CN': return '중국';
      case 'JP': return '일본';
      case 'VN': return '베트남';
      default: return code || '-';
    }
  };

  const formattedDate = new Date().toISOString().split('T')[0];
  const isImport = formData.declarationType === "import";

  // 신고번호 형식: 신고인부호(5자리) + 년도(2자리) + 일련번호(7자리)
  const declarationNumber = formData.declarationNumber || 
    (isImport ? '7-1-2023-0001234' : '7-1-2023-0005678X');

  // Custom styles based on declaration type
  const borderStyle = "border border-gray-300";
  const headerBgStyle = "bg-gray-100";
  const cellPadding = "p-1";
  const fontSizeXs = "text-xs";

  return (
    <div className="relative font-sans bg-[#f8f8f8] p-2 max-h-[70vh] overflow-y-auto">
      <div className="border border-gray-300 bg-white p-4">
        <div className="flex justify-between items-center mb-3">
          <img 
            src="/lovable-uploads/a1799379-9b37-45b5-b9ad-f86c64731195.png" 
            alt="UNI-PASS 로고" 
            className="h-6 opacity-80"
          />
          <div className="text-center flex-1">
            <h2 className="text-lg font-bold border-b-2 border-black pb-2 inline-block">
              {isImport ? "수입신고필증" : "수출신고필증(적재전, 갑지)"}
            </h2>
          </div>
          <div className="text-xs text-right opacity-70">
            ※ 처리기간: {isImport ? '3일' : '즉시'}
          </div>
        </div>
        
        {/* 신고 기본 정보 */}
        <div className={`grid grid-cols-6 mb-3 ${fontSizeXs} ${borderStyle}`}>
          <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>① 신고번호</div>
          <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.declarationNumber || declarationNumber}</div>
          <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>② 신고일</div>
          <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.declarationDate || formattedDate}</div>
          <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>③ 세관</div>
          <div className={`col-span-1 ${cellPadding}`}>{formData.customsOffice || formData.customsOfficeDept || '인천세관'}</div>
          
          {isImport ? (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>④ B/L(AWB)번호</div>
              <div className={`col-span-2 ${cellPadding} ${borderStyle}`}>{formData.blNumber || formData.masterBlNumber || 'ABCD20230001'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑤ 화물관리번호</div>
              <div className={`col-span-2 ${cellPadding}`}>{formData.cargoControlNumber || 'A0123456789'}</div>
            </>
          ) : (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>④ 수출업자</div>
              <div className={`col-span-5 ${cellPadding}`}>{formData.company || '수출업체명'}</div>
            </>
          )}
        </div>
        
        {/* 신고인/수입자 정보 (수입/수출에 따라 다름) */}
        <div className={`grid grid-cols-4 mb-3 ${fontSizeXs} ${borderStyle}`}>
          {isImport ? (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑥ 신고인</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.declarerName || '관세사무소'}
                {formData.declarerCode ? ` (${formData.declarerCode})` : ''}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑦ 통관계획</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.importDeclarationType || 'D'}</div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑧ 수입자</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.importerName || formData.company || '수입자명'}
                {formData.businessNumber ? ` (${formData.businessNumber})` : ''}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑨ 물품소재지</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.inspectionLocation || formData.warehouseLocation || '부두구역'}</div>
            </>
          ) : (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑥ 신고자</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.declarantName || '관세사무소'} 
                {formData.declarantCode ? ` (${formData.declarantCode})` : ''}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑦ 종류</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.exportDeclarationType || '일반수출'}</div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑧ 구분</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.transactionType === '11' ? '일반' : 
                 formData.transactionType === '21' ? '무상' : 
                 formData.transactionType || '일반'}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑨ 거래구분</div>
              <div className={`col-span-1 ${cellPadding}`}>
                {formData.transactionType || '11'}
              </div>
            </>
          )}
          
          {isImport ? (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑩ 납세의무자</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.taxPayer || formData.company || '회사명'}
                {formData.taxPayerCode ? ` (${formData.taxPayerCode})` : ''}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑪ 신고구분</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.importDeclarationType || 'A'}</div>
            </>
          ) : (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑩ 제조자</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.manufacturer || formData.company || '제조업체'}
                {formData.manufacturerCode ? ` (${formData.manufacturerCode})` : ''}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑪ 신고구분</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.csTypeExport || 'H'}</div>
            </>
          )}
          
          {isImport ? (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑫ 해외거래처</div>
              <div className={`col-span-3 ${cellPadding}`}>
                {formData.foreignSupplier || formData.shipperName || '해외 업체명'}
                {formData.foreignSupplierCode ? ` (${formData.foreignSupplierCode})` : ''}
              </div>
            </>
          ) : (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑫ 구매자</div>
              <div className={`col-span-3 ${cellPadding}`}>
                {formData.buyerName || formData.consigneeName || '해외 구매자'}
                {formData.buyerCode ? ` (${formData.buyerCode})` : ''}
              </div>
            </>
          )}
        </div>
        
        {/* 거래 및 운송 정보 */}
        <div className={`grid grid-cols-6 mb-3 ${fontSizeXs} ${borderStyle}`}>
          {isImport ? (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑬ 거래구분</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.transactionType || '11'}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑭ 원산지</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{getCountryName(formData.countryOrigin)}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑮ 부호</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.countryOrigin || '-'}</div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑯ 과세환율</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.exchangeRate ? Number(formData.exchangeRate).toLocaleString() : '1,300'}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑰ 운송형태</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>
                {formData.transportType === 'Sea' ? '10-Sea' : 
                 formData.transportType === 'Air' ? '40-Air' : 
                 formData.transportType || '-'}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑱ 총중량/순중량</div>
              <div className={`col-span-1 ${cellPadding}`}>
                {formData.grossWeight && formData.netWeight ? 
                 `${formData.grossWeight}/${formData.netWeight} KG` : 
                 (formData.netWeight ? `${formData.netWeight} KG` : '-')}
              </div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑲ 인도조건</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.incoterms || 'FOB'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑳ 선적지</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.loadingCountry || formData.portLoading || '-'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>㉑ 선기명</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.vesselName || '-'}</div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>㉒ 입항일</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.arrivalDate || formattedDate}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>㉓ 반출입항</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.arrivalPort || formData.portDischarge || '인천항'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>㉔ 반입예정일</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.entryDate || formattedDate}</div>
            </>
          ) : (
            <>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑬ 목적국</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{getCountryName(formData.destinationCountry || formData.tradeCountry)}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑭ 부호</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.destinationCountry || formData.tradeCountry || '-'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑮ 선적항</div>
              <div className={`col-span-1 ${cellPadding}`}>{formData.loadingCountryExport || formData.portLoading || '부산항'}</div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑯ 선박회사</div>
              <div className={`col-span-2 ${cellPadding} ${borderStyle}`}>
                {formData.vesselName || '-'}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑰ 적재예정일</div>
              <div className={`col-span-2 ${cellPadding}`}>{formData.declarationDate || formattedDate}</div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑱ 물품소재지</div>
              <div className={`col-span-5 ${cellPadding}`}>{formData.itemLocation || formData.warehouseLocation || '공항/항만구역'}</div>
              
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑲ 환급신청</div>
              <div className={`col-span-1 ${cellPadding} ${borderStyle}`}>{formData.refundApplication || 'N'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} ${borderStyle} font-medium`}>⑳ 보세구역</div>
              <div className={`col-span-3 ${cellPadding}`}>{formData.expectedBondedArea || '-'}</div>
            </>
          )}
        </div>
        
        {/* 품목 정보 */}
        <div className={`mb-3 ${fontSizeXs} ${borderStyle}`}>
          <div className="grid grid-cols-8 border-b border-gray-300">
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉕ 품명' : '㉑ 품명(영문)'}
            </div>
            <div className={`col-span-3 ${cellPadding} border-r border-gray-300`}>
              {isImport ? formData.itemName : formData.itemNameEng || formData.itemName || '-'}
            </div>
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉖ 상표' : '㉒ 상표명(영문)'}
            </div>
            <div className={`col-span-3 ${cellPadding}`}>{formData.tradeName || formData.brandName || formData.tradeNameEng || '-'}</div>
          </div>
          
          <div className="grid grid-cols-8">
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉗ 규격·모델' : '㉓ 규격·모델(영문)'}
            </div>
            <div className={`col-span-3 ${cellPadding} border-r border-gray-300`}>
              {isImport ? formData.modelSpec : formData.modelSpecEng || formData.modelSpec || '-'}
            </div>
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉘ 성질' : '㉔ 성분'}
            </div>
            <div className={`col-span-3 ${cellPadding}`}>{formData.composition || '-'}</div>
          </div>
        </div>
        
        {/* 품목가격 및 과세정보 */}
        <div className={`mb-3 ${fontSizeXs} ${borderStyle}`}>
          <div className="grid grid-cols-8">
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-b border-gray-300 font-medium`}>
              {isImport ? '㉙ 수량' : '㉕ 수량(단위)'}
            </div>
            <div className={`col-span-1 ${cellPadding} border-r border-b border-gray-300`}>
              {isImport 
                ? (formData.itemQuantity ? `${formData.itemQuantity} ${formData.itemUnit || ''}` : '-')
                : (formData.exportQuantity ? `${formData.exportQuantity} ${formData.exportUnit || formData.itemUnit || ''}` : '-')
              }
            </div>
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-b border-gray-300 font-medium`}>
              {isImport ? '㉚ 단가(USD)' : '㉖ 단가(USD)'}
            </div>
            <div className={`col-span-1 ${cellPadding} border-r border-b border-gray-300`}>
              {isImport 
                ? (formData.itemPrice && formData.itemQuantity && parseInt(formData.itemQuantity) > 0 
                   ? (parseInt(formData.itemPrice) / parseInt(formData.itemQuantity)).toFixed(2)
                   : '-')
                : (formData.unitPrice || '-')
              }
            </div>
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-b border-gray-300 font-medium`}>
              {isImport ? '㉛ 금액(USD)' : '㉗ 금액(USD)'}
            </div>
            <div className={`col-span-3 ${cellPadding} border-b border-gray-300`}>
              {isImport 
                ? (formData.itemPrice || '-')
                : (formData.amountExport || formData.itemPrice || '-')
              }
            </div>
            
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉜ 세번부호' : '㉘ 세번부호'}
            </div>
            <div className={`col-span-1 ${cellPadding} border-r border-gray-300`}>{formData.hsCode || '-'}</div>
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉝ 순중량' : '㉙ 순중량(KG)'}
            </div>
            <div className={`col-span-1 ${cellPadding} border-r border-gray-300`}>
              {isImport 
                ? (formData.netWeight ? `${formData.netWeight} KG` : '0 KG')
                : (formData.netWeightExport || formData.netWeight ? `${formData.netWeightExport || formData.netWeight} KG` : '0 KG')
              }
            </div>
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉞ C/S 품사' : '㉚ 신고가격(FOB)'}
            </div>
            <div className={`col-span-1 ${cellPadding} border-r border-gray-300`}>
              {isImport ? (formData.csInspection || '-') : (formData.itemPrice || '0')}
            </div>
            <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>
              {isImport ? '㉟ 세율' : '㉛ 총신고가격(FOB)'}
            </div>
            <div className={`col-span-1 ${cellPadding}`}>
              {isImport 
                ? (formData.dutyRate || (formData.itemPrice ? '8.0%' : '-'))
                : (formData.totalDeclaredPrice || formData.totalDeclaredValue || formData.itemPrice || '0')
              }
            </div>
          </div>
        </div>
        
        {/* 추가 정보 (수입/수출에 따라 다름) */}
        {isImport ? (
          <div className={`mb-3 ${fontSizeXs} ${borderStyle}`}>
            <div className="grid grid-cols-8">
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊱ 과세가격</div>
              <div className={`col-span-3 ${cellPadding} border-r border-gray-300`}>
                {formData.taxableValue || (formData.itemPrice && formData.exchangeRate 
                  ? `₩ ${(parseInt(formData.itemPrice) * parseInt(formData.exchangeRate)).toLocaleString()}` 
                  : (formData.itemPrice ? `₩ ${(parseInt(formData.itemPrice) * 1300).toLocaleString()}` : '-')
                )}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊲ 징수형태</div>
              <div className={`col-span-3 ${cellPadding}`}>{formData.collectionType || '11(수리전 납부)'}</div>
            </div>
            
            <div className="grid grid-cols-8 border-t border-gray-300">
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊳ 세액합계</div>
              <div className={`col-span-3 ${cellPadding} border-r border-gray-300`}>
                {formData.taxAmount || 
                  (formData.itemPrice && formData.exchangeRate && formData.dutyRate
                    ? `₩ ${Math.round(parseInt(formData.itemPrice) * parseInt(formData.exchangeRate) * 
                          (parseFloat(formData.dutyRate.replace('%', '')) / 100)).toLocaleString()}`
                    : (formData.itemPrice ? `₩ ${Math.round(parseInt(formData.itemPrice) * 1300 * 0.08).toLocaleString()}` : '0')
                  )
                }
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊴ 납부번호</div>
              <div className={`col-span-3 ${cellPadding}`}>{formData.paymentNumber || '20230001-1234'}</div>
            </div>
            
            <div className="grid grid-cols-8 border-t border-gray-300">
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊵ 총세액합계</div>
              <div className={`col-span-3 ${cellPadding} border-r border-gray-300`}>
                {formData.totalTaxAmount || 
                  (formData.itemPrice && formData.exchangeRate
                    ? `₩ ${Math.round(parseInt(formData.itemPrice) * parseInt(formData.exchangeRate) * 0.08).toLocaleString()}`
                    : (formData.itemPrice ? `₩ ${Math.round(parseInt(formData.itemPrice) * 1300 * 0.08).toLocaleString()}` : '0')
                  )
                }
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊶ 통관요건</div>
              <div className={`col-span-3 ${cellPadding}`}>{formData.importRequirements || 'N'}</div>
            </div>
            
            <div className="grid grid-cols-8 border-t border-gray-300">
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊷ 요건번호</div>
              <div className={`col-span-3 ${cellPadding} border-r border-gray-300`}>
                {formData.requirementNumber || '-'}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊸ 원산지증명</div>
              <div className={`col-span-3 ${cellPadding}`}>{formData.originCertificate || 'N'}</div>
            </div>
          </div>
        ) : (
          <div className={`mb-3 ${fontSizeXs} ${borderStyle}`}>
            <div className="grid grid-cols-6">
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㉜ 컨테이너번호</div>
              <div className={`col-span-2 ${cellPadding} border-r border-gray-300`}>{formData.containerNumber || '-'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㉝ 인보이스번호</div>
              <div className={`col-span-2 ${cellPadding}`}>{formData.invoiceNumber || '-'}</div>
            </div>
            
            <div className="grid grid-cols-6 border-t border-gray-300">
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㉞ 원산지기준</div>
              <div className={`col-span-2 ${cellPadding} border-r border-gray-300`}>{formData.originCriteriaExport || 'WO'}</div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㉟ 원산지국가</div>
              <div className={`col-span-2 ${cellPadding}`}>{getCountryName(formData.countryOrigin)}</div>
            </div>
            
            <div className="grid grid-cols-6 border-t border-gray-300">
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊱ 총중량(KG)</div>
              <div className={`col-span-2 ${cellPadding} border-r border-gray-300`}>
                {formData.totalWeightExport || formData.grossWeight || '0'}
              </div>
              <div className={`col-span-1 ${headerBgStyle} ${cellPadding} border-r border-gray-300 font-medium`}>㊲ 총포장갯수</div>
              <div className={`col-span-2 ${cellPadding}`}>
                {formData.totalPackagesExport || formData.totalPackages || '0'} {formData.packageUnit || '개'}
              </div>
            </div>
          </div>
        )}
        
        {/* 법적 문구 및 날짜 */}
        <div className="border-t-2 border-black pt-3 mt-3 text-center text-xs">
          <p>위와 같이 {isImport ? "수입" : "수출"}을 신고합니다.</p>
          <p className="mt-2 font-bold">한국관세청장 귀하</p>
          <div className="flex justify-end mt-4">
            <div className="border-2 border-gray-400 rounded-full w-24 h-24 flex items-center justify-center text-gray-500 font-bold">
              {formData.customsOffice || formData.customsOfficeDept || "인천"} 세관
            </div>
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-500 mt-1 text-center">
        {isImport ? "수입" : "수출"}신고필증 미리보기
      </p>
    </div>
  );
};

export default DeclarationCertificate;
