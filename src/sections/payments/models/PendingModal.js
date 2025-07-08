import React, { useEffect } from 'react';
import Close from '../../../assets/icons/Vector.png';
import '../../../Styles/payment/Models/PendingModal.css';

const PendingModal = ({ isOpen, onClose }) => {
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
      document.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.classList.remove('modal-open');
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-overlay2 active" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Payment Details</h2>
          <button className="close-btn" onClick={onClose}>
            <img src={Close} alt='close' className='close-icon'/>
          </button>
        </div>

        <div className="modal-body">
          <div className="student-name">
            <span className="name-label">Name:</span>
            <span className="name-value">Sushan Zir</span>
          </div>

          <div className="courses-container">
            <table className="courses-table">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Piano</td>
                  <td>5</td>
                </tr>
                <tr>
                  <td>Violin</td>
                  <td>11</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="payment-table-container">
            <div className="payment-table-header">
              <table>
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Payment(Rs)</th>
                    <th>Status</th>
                  </tr>
                </thead>
              </table>
            </div>
            
            <div className="payment-table-scroll">
              <table className="payment-table-body">
                <tbody>
                  <tr>
                    <td>January</td>
                    <td>3,500</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>February</td>
                    <td>3,500</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>March</td>
                    <td>4,000</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>April</td>
                    <td>4,000</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>May</td>
                    <td>4,200</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>June</td>
                    <td>4,200</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>July</td>
                    <td>4,500</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>August</td>
                    <td>4,500</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>September</td>
                    <td>4,800</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>October</td>
                    <td>4,800</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>November</td>
                    <td>5,000</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>December</td>
                    <td>5,000</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Bonus Lesson</td>
                    <td>2,500</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td>Workshop Fee</td>
                    <td>3,000</td>
                    <td>
                      <span className="status-badge status-pending">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="total-summary">
              <span className="total-label">Total Pending</span>
              <span className="total-amount">Rs. 57,500</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingModal;